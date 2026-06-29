from typing import Tuple, Optional

def evaluate_layout_safety(template_id: int) -> Tuple[int, int, Optional[str]]:
    max_score = 10
    
    if template_id in [1, 2, 3, 5]:
        return 10, max_score, None
    elif template_id == 4:
        return 8, max_score, "Two-column templates are less ATS parseable. Consider a single-column layout."
    
    return 0, max_score, "Unknown template. ATS parseability cannot be guaranteed."
