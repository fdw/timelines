from typing import Union, Dict, List

import numpy as numpy

from History import Event, Person


class Lanes(object):
    def __init__(self):
        self.__lanes: Dict[int, List[Union['Person', 'Event']]] = dict()

    def size(self) -> int:
        return len(self.__lanes)

    def add_lane(self) -> int:
        self.__lanes[self.size()] = []
        return self.size() - 1

    def lane_end(self, index: int):
        last_object = self.__lanes[index][-1]
        return last_object.death if isinstance(last_object, Person) else last_object.date

    def find_lane_ending_before(self, date: numpy.datetime64) -> int:
        for index in self.__lanes.keys():
            if self.lane_end(index) + numpy.timedelta64(1080, 'D') < date:
                return index

        return self.add_lane()

    def add_object(self, object: Union[Person, Event]):
        if isinstance(object, Person):
            self.add_person(object)
        else:
            self.add_event(object)

    def add_person(self, person: Person):
        lane_index = self.find_lane_ending_before(person.birth)
        self.__lanes[lane_index].append(person)

    def add_event(self, event: Event):
        lane_index = self.find_lane_ending_before(event.date)
        self.__lanes[lane_index].append(event)

    def lanes(self) -> List[List[Union[Person, Event]]]:
        return list(self.__lanes.values())
