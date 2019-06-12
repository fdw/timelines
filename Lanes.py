import datetime

import numpy as np


class Lanes(object):
    def __init__(self):
        self.__lanes = dict()

    def size(self) -> int:
        return len(self.__lanes)

    def add_lane(self) -> int:
        self.__lanes[self.size()] = 0
        return self.size() - 1

    def find_lane_ending_before(self, date: np.datetime64) -> int:
        for index in self.__lanes.keys():
            if self.__lanes[index] + np.timedelta64(1080, 'D') < date:
                return index
        return self.add_lane()

    def occupy(self, index: int, until: datetime):
        self.__lanes[index] = until
