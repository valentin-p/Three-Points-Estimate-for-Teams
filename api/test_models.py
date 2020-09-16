from models import Model, User, ThreePoint

def test_model_init():
    model = Model("myName")
    assert model.name == "myName"
    assert model.hash_code == '6bdef7b586149f810f4f070e0141b152b5ddc0b2bf497cf6f92fe16aee1cfb5f'
    

def test_model_get_empty():
    assert Model.get([], "1") == None

def test_model_get_missing():
    list_models = [Model("1")]
    assert Model.get(list_models, "2") == None

def test_model_get_first():
    model = Model("1")
    list_models = [model, Model("2")]
    assert Model.get(list_models, "1") == model
    assert Model.get(list_models, "1").hash_code == model.hash_code

def test_model_get_last():
    model = Model("2")
    list_models = [Model("1"), model]
    assert Model.get(list_models, "2") == model
    assert Model.get(list_models, "2").hash_code == model.hash_code


def test_model_get_names_empty():
    assert Model.get_names([]) == []
    
def test_model_get_names_single():
    model = Model("1")
    assert Model.get_names([model]) == [model.name]
    
def test_model_get_names_multi():
    model = Model("1")
    model2 = Model("2")
    user = User("3")
    three_point = ThreePoint("4", 1,2,3)
    assert Model.get_names([model, model2, user, three_point]) == \
        [model.name, model2.name, user.name, three_point.name]
    

def test_model_get_hash_codes_empty():
    hsh = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    assert Model.get_hash_codes([]) == hsh
    
def test_model_get_hash_codes_single():
    hsh = 'e0bc614e4fd035a488619799853b075143deea596c477b8dc077e309c0fe42e9'
    model = Model("1")
    assert Model.get_hash_codes([model]) == hsh
    
def test_model_get_hash_codes_multi():
    hsh = '94818e803bac20288e14b6b1a58fcab1964c815d9b88d004c231ce16c5ea7caf'
    model = Model("1")
    model2 = Model("2")
    user = User("3")
    three_point = ThreePoint("4", 1,2,3)
    assert Model.get_hash_codes([model, model2, user, three_point]) == hsh


def test_user_hash_code_single():
    hsh = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'
    user = User("1")
    assert user.hash_code == hsh

def test_user_get_hash_codes_single():
    hsh = 'e0bc614e4fd035a488619799853b075143deea596c477b8dc077e309c0fe42e9'
    user = User("1")
    assert Model.get_hash_codes([user]) == hsh


def test_three_point_from_dict_same():
    three_point = ThreePoint("4", 1,2,4)
    three_point_dict = ThreePoint.from_dict({"user": 4, "o": "1", "m": "2", "p": "4"})
    assert three_point.name == three_point_dict.name
    assert three_point.optimistic == three_point_dict.optimistic
    assert three_point.most_likely == three_point_dict.most_likely
    assert three_point.pessimistic == three_point_dict.pessimistic
    assert three_point.estimate() == three_point_dict.estimate()
    assert three_point.serialize() == three_point_dict.serialize()
    assert three_point.hash_code != three_point_dict.hash_code

def test_three_point_serialize_simple():
    three_point = ThreePoint("4", 1,5,8)
    assert three_point.serialize() == \
        (three_point.name, [three_point.optimistic, three_point.most_likely, three_point.pessimistic])

def test_three_point_estimate_zero():
    three_point = ThreePoint("4", 0,0,0)
    assert three_point.estimate() == 0
    
def test_three_point_estimate_same():
    three_point = ThreePoint("1", 1,2,9)
    three_point2 = ThreePoint("4", 1,2,9)
    assert three_point.estimate() == three_point2.estimate()
    
def test_three_point_estimate_identical():
    three_point = ThreePoint("1", 2,5,8)
    three_point2 = ThreePoint("4", 5,5,5)
    assert three_point.estimate() == three_point2.estimate()
    
def test_three_point_estimate_simple():
    three_point = ThreePoint("4", 1,2,3)
    assert three_point.estimate() == 2
    
def test_three_point_estimate_complex():
    three_point = ThreePoint("4", 5,8,13)
    assert round(three_point.estimate(),3) == 8.333
    assert three_point.estimate() == (5+8*4+13)/6

def test_three_point_hash_code_single():
    hsh = 'f723386d3487b4a2dab0c775fb5dc403460417fba98906052c345fd1029433e5'
    three_point = ThreePoint("4", 1,2,3)
    assert three_point.hash_code == hsh
    
def test_three_point_get_hash_codes_single():
    hsh = 'd32f0a3fce05302cb16e2a78a074119e7ea89d6092900b2db7298bcf1fba0eec'
    three_point = ThreePoint("4", 1,2,3)
    assert Model.get_hash_codes([three_point]) == hsh
