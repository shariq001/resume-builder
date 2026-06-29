import os
from uuid import UUID
from pydantic import BaseModel
try:
    from weasyprint import HTML # type: ignore
except (ImportError, OSError):
    HTML = None
from backend.repositories.resume_repository import ResumeRepository

class PDFGenerationResult(BaseModel):
    file_path: str
    download_url: str

class PDFService:
    def __init__(self, resume_repo: ResumeRepository):
        self.resume_repo = resume_repo
        self.storage_dir = "storage/pdfs"
        os.makedirs(self.storage_dir, exist_ok=True)

    async def generate_pdf(self, resume_id: UUID, user_id: UUID) -> PDFGenerationResult:
        resume = self.resume_repo.get_by_id(resume_id, user_id)
        if not resume:
            raise ValueError("Resume not found")

        # Mock HTML generation - will integrate with ATS template react rendering
        html_content = f"<h1>Resume: {resume.title}</h1><p>Template ID: {resume.template_id}</p>"
        
        file_name = f"{user_id}_{resume_id}_v{resume.version}.pdf"
        file_path = os.path.join(self.storage_dir, file_name)
        
        if HTML is not None:
            HTML(string=html_content).write_pdf(file_path)
        else:
            # Fallback if GTK3 is missing on Windows
            with open(file_path, "wb") as f:
                f.write(b"%PDF-1.4\n1 0 obj\n<< /Title (Mock PDF - GTK3 Missing) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF")
        
        download_url = f"/api/v1/resumes/{resume_id}/download"
        
        resume.pdf_url = download_url
        self.resume_repo.update(resume, save_snapshot=False)
        
        return PDFGenerationResult(
            file_path=file_path,
            download_url=download_url
        )
