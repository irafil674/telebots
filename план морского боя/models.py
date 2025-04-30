class Field:
    def __init__(self, data):
        # инициализация с помощью data
        self.field = [[False] * 10] * 10
        self.field_show = [[False] * 10] * 10
        self.id = ...
        self.field = ...
        pass
    def attacked(self, x, y):
        # атакуем в координату (x, y) и смотрим результат -- мимо, попал, убит
        pass
    def show(self):
        #выдаёт строку с видимым полем, которуб потом печает бот
        pass        