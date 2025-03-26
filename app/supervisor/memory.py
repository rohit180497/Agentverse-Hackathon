class SessionMemory:
    def __init__(self):
        self.trip_data = {
            "source": None,
            "destination": None,
            "start_date": None,
            "end_date": None
        }

    def update(self, **kwargs):
        for key in self.trip_data:
            if key in kwargs and kwargs[key] is not None:
                self.trip_data[key] = kwargs[key]

    def get_trip_details(self):
        return self.trip_data

    def get_missing_fields(self):
        return [key for key, value in self.trip_data.items() if not value]

    def is_complete(self):
        return all(self.trip_data.values())