from pathlib import Path
import os
import sys
import tempfile

try:
    import pymupdf
except ImportError:
    print(
        "PyMuPDF is required. Install it with: "
        "python -m pip install -r scripts/requirements-quiz-slides.txt",
        file=sys.stderr,
    )
    raise SystemExit(1)


PROJECT_ROOT = Path(__file__).resolve().parent.parent
PDF_PATH = PROJECT_ROOT / "utils" / "Slides.pdf"
IMAGE_DIR = PROJECT_ROOT / "images" / "quiz-slides"
EXPECTED_PAGE_COUNT = 11
RENDER_SCALE = 1.6


def main():
    if not PDF_PATH.is_file():
        print(f"PDF not found: {PDF_PATH}", file=sys.stderr)
        return 1

    try:
        document = pymupdf.open(PDF_PATH)
    except Exception as error:
        print(f"Could not open {PDF_PATH.name}: {error}", file=sys.stderr)
        return 1

    with document:
        if document.page_count != EXPECTED_PAGE_COUNT:
            print(
                f"Expected {EXPECTED_PAGE_COUNT} pages in {PDF_PATH.name}, "
                f"but found {document.page_count}. No images were changed.",
                file=sys.stderr,
            )
            return 1

        IMAGE_DIR.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory(
            prefix="quiz-slides-", dir=IMAGE_DIR.parent
        ) as temporary_directory:
            staged_dir = Path(temporary_directory)
            staged_paths = []

            for page_number, page in enumerate(document, start=1):
                image_name = f"slide-{page_number:02d}.png"
                staged_path = staged_dir / image_name
                page.get_pixmap(
                    matrix=pymupdf.Matrix(RENDER_SCALE, RENDER_SCALE),
                    alpha=False,
                ).save(staged_path)
                staged_paths.append((staged_path, IMAGE_DIR / image_name))

            for staged_path, image_path in staged_paths:
                os.replace(staged_path, image_path)

    print(f"Updated {EXPECTED_PAGE_COUNT} slide images in {IMAGE_DIR.relative_to(PROJECT_ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())