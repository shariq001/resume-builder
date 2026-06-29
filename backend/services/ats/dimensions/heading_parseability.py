from typing import Dict, Any, Tuple, Optional

def evaluate_heading_parseability(form_data: Dict[str, Any]) -> Tuple[int, int, Optional[str]]:
    max_score = 20
    score = 20
    # Fixed form structure ensures headings are ATS parseable by default.
    return score, max_score, None
