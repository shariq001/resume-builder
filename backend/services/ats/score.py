from typing import Dict, Any
from backend.schemas.ats import ATSScoreResult, DimensionScore
from .dimensions.section_structure import evaluate_section_structure
from .dimensions.heading_parseability import evaluate_heading_parseability
from .dimensions.date_format import evaluate_date_format
from .dimensions.contact_completeness import evaluate_contact_completeness
from .dimensions.keyword_density import evaluate_keyword_density
from .dimensions.layout_safety import evaluate_layout_safety

def get_grade(total_score: int) -> str:
    if total_score >= 90: return 'A'
    if total_score >= 75: return 'B'
    if total_score >= 60: return 'C'
    if total_score >= 45: return 'D'
    return 'F'

def compute_score(form_data: Dict[str, Any], template_id: int) -> ATSScoreResult:
    dims = {}
    hints = []
    total_score = 0
    
    evaluators = {
        "Section Structure": lambda: evaluate_section_structure(form_data),
        "Heading Parseability": lambda: evaluate_heading_parseability(form_data),
        "Date Format Compliance": lambda: evaluate_date_format(form_data),
        "Contact Field Completeness": lambda: evaluate_contact_completeness(form_data),
        "Keyword Density": lambda: evaluate_keyword_density(form_data),
        "Layout Safety": lambda: evaluate_layout_safety(template_id)
    }
    
    for label, evaluator in evaluators.items():
        score, max_score, hint = evaluator()
        score = max(0, min(score, max_score))
        total_score += score
        
        dims[label] = DimensionScore(score=score, max_score=max_score, label=label, hint=hint)
        if hint:
            hints.append(hint)
            
    total_score = max(0, min(total_score, 100))
    grade = get_grade(total_score)
    
    return ATSScoreResult(
        total_score=total_score,
        grade=grade, # type: ignore
        breakdown=dims,
        improvement_hints=hints[:5]
    )
