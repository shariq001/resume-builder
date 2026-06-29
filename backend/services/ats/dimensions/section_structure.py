from typing import Dict, Any, Tuple, Optional

def evaluate_section_structure(form_data: Dict[str, Any]) -> Tuple[int, int, Optional[str]]:
    max_score = 25
    score = 0
    missing = []

    if form_data.get("summary"):
        score += 6
    else:
        missing.append("Summary")
        
    if form_data.get("experience") and len(form_data["experience"]) > 0:
        score += 7
    else:
        missing.append("Work Experience")
        
    if form_data.get("education") and len(form_data["education"]) > 0:
        score += 6
    else:
        missing.append("Education")
        
    if form_data.get("skills") and len(form_data["skills"]) > 0:
        score += 6
    else:
        missing.append("Skills")

    hint = f"Add missing sections: {', '.join(missing)}" if missing else None
    return score, max_score, hint
