from pydantic import BaseModel
class Post(BaseModel):
    title:str
    slug:str
