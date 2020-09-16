from typing import List
import json
from hashlib import sha256 as hash_sha256

class Model():
    def __init__(self, name):
        self.name = name
        self.hash_code = hash_sha256(name.encode()).hexdigest()
    
    @staticmethod
    def get(lst: List, name: str):
        return next((u for u in lst if u.name == name), None)
        
    @staticmethod
    def get_names(lst: List):
        return [t.name for t in lst]

    @staticmethod
    def get_hash_codes(lst: List):
        return hash_sha256('.'.join([e.hash_code for e in lst]).encode()).hexdigest()

class User(Model):
    def __init__(self, name):
        self.name = name
        self.hash_code = hash_sha256(name.encode()).hexdigest()
        
    def serialize(self):
        return self.name

    def __repr__(self):
        return '<User: {}>'.format(self.name)

class ThreePoint():
    def __init__(self, name: str, o: float, m: float, p: float):
        self.name = name
        self.optimistic = o
        self.most_likely = m
        self.pessimistic = p
        self.hash_code = hash_sha256(name.encode()+str(31*o+31*m+31*p).encode()).hexdigest()

    @classmethod
    def from_dict(cls, dict):
        return cls(str(dict["user"]), float(dict["o"]), float(dict["m"]), float(dict["p"]))

    def estimate(self):
        return (self.optimistic + 4*self.most_likely + self.pessimistic) / 6

    def serialize(self):
        return (self.name, [self.optimistic, self.most_likely, self.pessimistic])
    
    def __repr__(self):
        return '<ThreePoints: {}: {},{},{}>'\
            .format(self.name, self.optimistic, self.most_likely, self.pessimistic)
