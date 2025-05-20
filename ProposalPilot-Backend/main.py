from fastapi import FastAPI
from langchain_groq import ChatGroq
from fastapi import FastAPI, File, UploadFile, Form
from dotenv import load_dotenv
from docx import Document
from langchain_core.messages import SystemMessage, HumanMessage
import json
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
import io
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient(os.getenv('MONGO_CONNECTION_STRING'))
db = client.screening

llm = ChatGroq(
    model="deepseek-r1-distill-llama-70b",
    temperature=0,
)

@app.get("/")
async def root():
    return {"status": "API is online"}

@app.post("/extract_company_data")
async def extract_company_data(file: UploadFile = File(...)):
    doc = Document(io.BytesIO(await file.read()))
    # Extract and store text from each paragraph
    all_paragraphs_text = ""

    for i, para in enumerate(doc.paragraphs, start=1):
        if para.text.strip():  
            all_paragraphs_text += f"\n{para.text}\n"      

    prompt = """
Extract data from the provided file and return an array of dictionaries:

'title' (string): The title or heading of a section

'content' (string): The corresponding text content under that title

'available' (string): yes/no (indicating if the content mentions availability)

'category' (string): The category of the content (e.g., "Company Overview",
"Authorized Representative",
  "Compliance & Identification",
  "Financials",
  "Services Offered",
  "Documents & Certifications",
  "Certifications & Diversity",
  "Key Personnel")

**Example json Output Format without any preamble:**  
{
    'data': [  
        {  
            "title": "Example Section 1",  
            "content": "This is the text under the first heading..."  ,
            "available": "yes",
            "category": "Company Overview"
        },  
        {  
            "title": "Example Section 2",  
            "content": "This is the text under the second heading...",
            "available": "no",
            "category": "Financials"
        }  
    ]  
}

 Return the JSON response without any preamble and without any markdown so that I can parse output in json.loads() of python function. 

"""
    
    message = [
        SystemMessage(content=prompt, role="system"),
        HumanMessage(content=all_paragraphs_text, role="human"),
    ]
    
    response = llm.invoke(message).content.split('</think>')[-1].split('json')[-1].replace("```",'') 
    
    collection = db.company_data1
    
    data = json.loads(response)
    
    data['id'] = 1
    
    query = {"id": 1}
    
    new_document = {
        "$set": data
    }
    
    collection.update_one(query,new_document,upsert=True) 
    
    return {
        'status': 'success',
    }
    
@app.get("/get_company_data")
async def get_company_data(
):
    collection = db.company_data1
    
    data = collection.find_one({"id": 1})
    
    del data['_id']
    
    return {
        'data': data
    }
    
@app.post("/criteria_generator")
async def criteria_generator(
    file: UploadFile = File(...)
):
    reader = PdfReader(io.BytesIO(await file.read()))

    # Extract and store text from each page
    all_pages_text = []

    for page_num, page in enumerate(reader.pages, start=1):
        text = page.extract_text()
        all_pages_text.append({
            "page": page_num,
            "text": text
    })
        
    prompt = """
Extract data from given provided content and return an array of dictionary. 

"title" (string) : the title of heading section,

"content" (string) : required/optional/corresponging content/some suggestions,

"category" (string) : category of the content (Compliance Check [ex: company years of existence, years of experience of temporary staffing, government registered, bank letter of creditworthiness, services required that have been done by company comma separated values, W-9 form, certificate of insurance in comma separated value, licences comma separated values, HUB/DBE status, key personnel comma separated values, MBE, WBE]
    (MBE,HUB and WBE certification should be related Administrative, IT, Legal & Credentialing Staffing if it does not fit in this areas skip it.), 
    Preference [ex: 7 years of experience will have more preference than 3 years of experience, employer should be native americans, particular tribe/race will have more preference] , 
    Forms/Attachments [ex. RSVP form, company identification form, reference and experience form, acknowledgement form, etc any forms or attachments, keep only the form name not the fields within the form], 
    Format of Document [ex: a document size in pages, document file name format, font size, font style, any particular point of document page limit, TOC Requirements, line spacing, anything else],
    Evaluation Criteria [ex: criteria for evaluating RFP] ,
    Payment Criteria [ex: liability compensations,anything else],
    Submission [ex: due date, due time, submission mode(if offline then content should be location of office / if online content should be email/fax or any wireless communication forms)], 
)

Example json Output Format:*  
{
    "data": [  
        {  
            "title": "Due Date",  
            "content": "30/09/2024"  ,
            "category": "Submission",
            "page_no": "1"
        },  
        {  
            "title": "Document File Name Format",  
            "content": "CompanyName_YearsofExistence",
            "category": "Format of Document",
            "page_no": "10"
        }  
    ]  
}

Return the JSON response without any markdown and without any preamble text so that I can parse in json.loads() of python function. 

"""

    criteria = []
    
    # Process 3 pages at a time
    for i in range(0, len(all_pages_text), 3):
        # Get a slice of up to 3 pages
        batch = all_pages_text[i:i+3]
        
        # Combine the pages into a single string
        combined_pages = ""
        for page in batch:
            combined_pages += f"""
                Content: {page['text']}
                Page No: {page['page']}
                
            """
        
        # Create the message
        message = [
            SystemMessage(content=prompt, role="system"),
            HumanMessage(content=combined_pages, role="human"),
        ]
        
        # Process the response
        response = llm.invoke(message).content.split('</think>')[-1].split('json')[-1].replace("```",'')
        criteria += json.loads(response)['data']
            
    collection = db.criteria
    
    collection.delete_many({})

    collection.insert_many(criteria)
    
    prompt = """
Extract data from given provided content and return an array of dictionary. 

"title" (string) : Identify biased clauses that could put ConsultAdd at a disadvantage (e.g., unilateral termination rights) (Don't mention small things)

"severity" (string) : severity of the content(high, medium, low)

"description" (string) : corresponding description

"suggestion" (string) : Suggest modifications to balance contract terms (e.g., adding a notice period for termination).

Example json Output Format:*  
{
    "data": [  
        {  
            "title": "Risk Name",  
            "severity": "high"  ,
            "description": "Description of risk 1",
            "suggestion": "Suggestion to mitigate risk 1",
            "page_no": "1"
        },  
        {  
            "title": "Risk Name",  
            "severity": "medium",
            "description": "Description of risk 2",
            "suggestion": "Suggestion to mitigate risk 2",
            "page_no": "10"
        }
    ]  
}

 Return the JSON response without any markdown and without any preamble text so that I can parse in json.loads() of python function. 

"""

    risk = []

    for i in all_pages_text:
        human_message = f"""
            Page No: {i['page']}
            Content: {i['text']}
        """

        message = [
                SystemMessage(content=prompt, role="system"),
                HumanMessage(content=human_message, role="human"),
            ]
        response = llm.invoke(message).content.split('</think>')[-1].split('json')[-1].replace("```",'') 
        risk += json.loads(response)['data']
        
    collection = db.risk
    
    collection.delete_many({})

    collection.insert_many(risk)
    
    return {
        'status': 'success',
    }
    
    
@app.get("/get_criteria")
async def get_criteria(
):

    collection = db.criteria
    
    category = ['Compliance Check', 'Preference', 'Forms/Attachments', 'Format of Document', 'Evaluation Criteria', 'Payment Criteria', 'Submission']
    
    length = []
    
    for i in category:
        length.append(
            {
                'category': i,
                'len': len(list(collection.find({'category': i})))
            }
        )
        
    collection = db.risk
        
    length.append(
        {
            'category': 'Risk Analysis',
            'len': len(list(collection.find({})))
        }
    )
        
    return {
        'data': length
    }
    
@app.get("/analyzed_rfp")
async def analyzed_rfp(
):
    collection = db.company_data1

    result = collection.find_one({'id':1})

    company_data = ""
    criteria_data = ""

    for item in result['data']:
        company_data += item["title"] + ": " + item["content"] + "\n\n"
        
    collection = db.criteria

    result = list(collection.find({'category':'Compliance Check'}))

    for item in result:
        criteria_data += item["title"] + ": " + item["content"] + "\n\n"
        
    prompt = """
You are a compliance officer evaluating whether ConsultAdd is legally eligible to bid for a contract based on the provided criteria. Your task is to verify eligibility strictly against the given requirements, focusing on:

State Registration – Is the company properly registered in the required jurisdiction(s) and you can ignore optional ones?

Certifications – Does the company hold or satifies all mandatory/required certifications and you can ignore optional ones?

Insurance – Does the company meet all the mandatory/required insurance requirements and you can ignore optional ones?

Assumptions:

Employees are experienced.

The company has sufficient resources (can subcontract or hire temp staff if needed).

Do not assume compliance for certifications, licenses, or insurance—these must be explicitly verified.\

Output Format (JSON only):

{
    "eligible": "yes/no",  
    "reason": "Brief explanation of eligibility decision. If 'no', specify missing requirements."  
}
Rules:

Mark eligible: "yes" only if all criteria are fully met.

If any certification, license, or insurance which is required is missing, mark eligible: "no" and state the gap.

If it is optional you can skip it, mark eligible: "yes".

Return raw JSON only (no markdown, no additional text).

"""

    human_message = f"""
        Company Data: 
        {company_data}
        
        Criteria Data: 
        {criteria_data}
    """

    message = [
        SystemMessage(content=prompt, role="system"),
        HumanMessage(content=human_message, role="human"),
    ]
    
    response = llm.invoke(message).content.split('</think>')[-1].split('json')[-1].replace("```",'') 
    
    collection = db.result
    
    collection.delete_many({})

    collection.insert_one(json.loads(response))
    
    return {
        'data': json.loads(response)
    }
    
@app.get("/compliance_check")
async def compliance_check():
    collection = db.criteria
    result = list(collection.find({'category':'Compliance Check'}))
    
    for i in result:
        del i['_id']
    
    return {
        'data': result
    }
    
@app.get("/preference")
async def preference():
    collection = db.criteria

    result = list(collection.find({'category':'Preference'}))
    
    for i in result:
        del i['_id']
    
    return {
        'data': result
    }
    

@app.get("/forms_attachments")
async def forms_attachments():
    collection = db.criteria
    result = list(collection.find({'category': 'Forms/Attachments'}))
    for i in result:
        del i['_id']
    
    return {
        'data': result
    }
    

@app.get("/format_of_document")
async def format_of_document():
    collection = db.criteria
    result = list(collection.find({'category': 'Format of Document'}))
    for i in result:
        del i['_id']
    
    return {
        'data': result
    }

@app.get("/evaluation_criteria")
async def evaluation_criteria():
    collection = db.criteria
    result = list(collection.find({'category': 'Evaluation Criteria'}))
    for i in result:
        del i['_id']
    
    return {
        'data': result
    }

@app.get("/payment_criteria")
async def payment_criteria():
    collection = db.criteria
    result = list(collection.find({'category': 'Payment Criteria'}))
    
    for i in result:
        del i['_id']
    
    return {
        'data': result
    }

@app.get("/submission")
async def submission():
    collection = db.criteria
    result = list(collection.find({'category': 'Submission'}))
    
    for i in result:
        del i['_id']
    
    return {
        'data': result
    }
    

@app.get("/risk_analysis")
async def risk_analysis():
    collection = db.risk
    result = list(collection.find({}))
    
    for i in result:
        del i['_id']
    
    return {
        'data': result
    }
    