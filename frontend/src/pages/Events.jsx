import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Navbar = () => {
  return (
    <nav className="w-full bg-gray-800 p-4 text-white flex justify-between">
      <div className="text-lg font-bold">Event Manager</div>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">
          Events
        </Link>
        <Link to="/attendees" className="hover:underline">
          Attendees
        </Link>
        <Link to="/tasks" className="hover:underline">
          Tasks
        </Link>
      </div>
    </nav>
  );
};

const Events = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (id) => {
    try {
      const res = await api.delete(`/events/${id}`);

      fetchEvents();
    } catch (e) {}
  };

  return (
    <div className="w-screen h-screen">
      <Navbar />
      <div className="p-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Events</h1>
          <AddEventDialog fetchEvents={fetchEvents} />
        </div>

        <Table>
          <TableCaption>A list of your recent Events</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.name}</TableCell>
                <TableCell>{event.desc}</TableCell>
                <TableCell>{event.loc}</TableCell>
                <TableCell className="text-right">{event.date}</TableCell>
                <TableCell>
                  <Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DialogTrigger asChild>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                        </DialogTrigger>
                        <DropdownMenuItem
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <EditEventDetails
                      eventData={event}
                      fetchEvents={fetchEvents}
                    />
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Events;

const EditEventDetails = ({ eventData, fetchEvents }) => {
  const [editEventData, setEventData] = useState(eventData);

  const handleEventSubmit = async () => {
    try {
      const res = await api.put(`/events/${editEventData.id}`, editEventData);

      fetchEvents();
    } catch (e) {}
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Event</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid w-full  items-center gap-1.5">
          <Label>Name</Label>
          <Input
            type="text"
            id="name"
            placeholder="Ex: John Doe"
            value={editEventData?.name}
            onChange={(e) =>
              setEventData({
                ...editEventData,
                name: e.target.value,
              })
            }
          />
        </div>
        <div className="grid w-full  items-center gap-1.5">
          <Label>Description </Label>
          <Input
            type="text"
            id="units"
            placeholder="Ex: 20"
            value={editEventData?.desc}
            onChange={(e) =>
              setEventData({
                ...editEventData,
                desc: e.target.value,
              })
            }
          />
        </div>
        <div className="grid w-full  items-center gap-1.5">
          <Label htmlFor="amount">Location</Label>
          <Input
            type="text"
            id="loc"
            placeholder="Location"
            value={editEventData?.loc}
            onChange={(e) =>
              setEventData({ ...editEventData, loc: e.target.value })
            }
          />
        </div>
        <div className="grid w-full  items-center gap-1.5">
          <Label htmlFor="status">Date</Label>
          <Input
            type="date"
            id="date"
            placeholder="Date"
            value={editEventData?.date}
            onChange={(e) =>
              setEventData({ ...editEventData, date: e.target.value })
            }
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button onClick={handleEventSubmit}>Submit</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export const AddEventDialog = ({ fetchEvents }) => {
  const [addEventDetails, setEventDetails] = useState({});

  const handleEventSubmit = async () => {
    try {
      const res = await api.post(`/events`, addEventDetails);

      fetchEvents();
    } catch (e) {}
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new event</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid w-full  items-center gap-1.5">
            <Label htmlFor="email">Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="Ex: John Doe"
              value={addEventDetails?.name}
              onChange={(e) =>
                setEventDetails({
                  ...addEventDetails,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className="grid w-full  items-center gap-1.5">
            <Label>Description </Label>
            <Input
              type="text"
              placeholder="Ex: New York"
              value={addEventDetails?.desc}
              onChange={(e) =>
                setEventDetails({
                  ...addEventDetails,
                  desc: e.target.value,
                })
              }
            />
          </div>
          <div className="grid w-full  items-center gap-1.5">
            <Label>Location</Label>
            <Input
              type="text"
              id="loc"
              placeholder="Location"
              value={addEventDetails?.loc}
              onChange={(e) =>
                setEventDetails({ ...addEventDetails, loc: e.target.value })
              }
            />
          </div>
          <div className="grid w-full  items-center gap-1.5">
            <Label>Date</Label>
            <Input
              type="date"
              id="date"
              placeholder="Date"
              value={addEventDetails?.date}
              onChange={(e) =>
                setEventDetails({ ...addEventDetails, date: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleEventSubmit}>Submit</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
