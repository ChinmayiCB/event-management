import React, { useEffect, useState } from "react";
import api from "../api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  Dialog,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Navbar } from "./Events";

const Attendees = () => {
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data);
    } catch (e) {}
  };

  const fetchAttendees = async () => {
    try {
      const response = await api.get("/attendees");
      setAttendees(response.data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchAttendees();
    fetchEvents();
  }, []);

  const handleDeleteAttendee = async (id) => {
    try {
      const res = await api.delete(`/attendees/${id}`);

      fetchAttendees();
    } catch (e) {}
  };

  return (
    <div className="w-screen h-screen ">
      <Navbar />
      <div className="p-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Attendees</h1>
          <AddAttendeeDialog fetchAttendees={fetchAttendees} events={events} />
        </div>

        <Table>
          <TableCaption>A list of Attendees</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendees &&
              attendees.map((attendee) => (
                <TableRow key={attendee.id}>
                  <TableCell>{attendee.name}</TableCell>
                  <TableCell>{attendee.email}</TableCell>
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
                        <DropdownMenuContent>
                          <DialogTrigger asChild>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem
                            onSelect={() => handleDeleteAttendee(attendee.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <EditAttendeeDetails
                        attendeeData={attendee}
                        fetchAttendees={fetchAttendees}
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

export default Attendees;

const EditAttendeeDetails = ({ attendeeData, fetchAttendees }) => {
  const [attendee, setAttendee] = useState(attendeeData);

  const handleEditAttendee = async () => {
    try {
      await api.put(`/attendees/${attendee.id}`, attendee);
      fetchAttendees();
    } catch (e) {}
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Attendee</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={attendee.name}
            onChange={(e) => setAttendee({ ...attendee, name: e.target.value })}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={attendee.email}
            onChange={(e) =>
              setAttendee({ ...attendee, email: e.target.value })
            }
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button onClick={handleEditAttendee}>Submit</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

const AddAttendeeDialog = ({ fetchAttendees, events = [] }) => {
  const [attendee, setAttendee] = useState({
    name: "",
    email: "",
    event_id: "",
  });

  const handleAddAttendee = async () => {
    try {
      await api.post("/attendees", attendee);
      fetchAttendees();
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
          <DialogTitle>Add Attendee</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={attendee.name}
              onChange={(e) =>
                setAttendee({ ...attendee, name: e.target.value })
              }
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={attendee.email}
              onChange={(e) =>
                setAttendee({ ...attendee, email: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label>Events</Label>
          <Select
            onValueChange={(value) =>
              setAttendee({
                ...attendee,
                event_id: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>

            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleAddAttendee}>Submit</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
