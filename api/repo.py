from .models import Model, User, ThreePoint

DEFAULT_USER_NAMES = tuple(["Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel"])


class Repo():
    users = []
    three_points = []


    def get_users(self, name = None):
        if not name:
            return self.users
        else:
            return Model.get(self.users, name)

    def get_users_names(self):
        return Model.get_names(self.users)

    def add_user_name(self, name):
        self.users.append(User(name))

    def add_user(self, user):
        self.users.append(user)

    def delete_user(self, name):
        for i, o in enumerate(self.users):
            if o.name == name:
                del self.users[i]
                break

    def clear_users(self):
        self.users = []


    def get_three_points(self, name = None):
        if not name:
            return self.three_points
        else:
            return Model.get(self.three_points, name)
        
    def add_three_point(self, three_point):
        self.three_points.append(three_point)

    def add_three_point_from_dict(self, dct):
        self.add_three_point(ThreePoint.from_dict(dct))

    def delete_three_point(self, name):
        for i, o in enumerate(self.three_points):
            if o.name == name:
                del self.three_points[i]
                break

    def clear_three_points(self):
        self.three_points = []

        
    def get_missing_names(self):
        three_point_user_names = Model.get_names(self.three_points)
        return [name for name in Model.get_names(self.users) if name not in three_point_user_names]

    def get_hash_code(self):
        return Model.get_hash_codes(self.users+self.three_points)