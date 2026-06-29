from backend.services.keywords.matcher import match, get_job_keywords, extract_resume_keywords

def test_tokenize_job_description():
    jd = "We are looking for a Python developer with React and AWS experience. Python is required."
    keywords = get_job_keywords(jd)
    
    assert "python" in keywords
    assert "react" in keywords
    assert "aws" in keywords
    assert "and" not in keywords
    assert keywords.count("python") == 2

def test_extract_resume_keywords():
    form_data = {
        "skills": ["Python", "React", "Docker"],
        "experience": [
            {"description": "Built systems with AWS and Kubernetes"}
        ]
    }
    
    resume_keywords = extract_resume_keywords(form_data)
    
    assert "python" in resume_keywords
    assert "react" in resume_keywords
    assert "docker" in resume_keywords
    assert "aws" in resume_keywords
    assert "kubernetes" in resume_keywords
    assert "built" in resume_keywords
    assert "with" not in resume_keywords

def test_match_algorithm():
    jd = "Python, React, AWS, AWS, Docker, Kubernetes"
    form_data = {
        "skills": ["Python", "React"]
    }
    
    result = match(jd, form_data)
    
    # jd tokens (unique): python, react, aws, docker, kubernetes
    # resume tokens: python, react
    # matched: python, react
    # missing: aws, docker, kubernetes
    
    assert "python" in result.matched_keywords
    assert "react" in result.matched_keywords
    assert "aws" in result.missing_keywords
    
    # missing should be sorted by frequency: aws appears twice in JD
    assert result.missing_keywords[0] == "aws"
    
    assert result.total_jd_keywords == 5
    assert result.total_matched == 2
    assert result.match_percentage == 40.0
