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
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks"); // Adjust endpoint as needed
      setTasks(response.data);
    } catch (e) {}
  };

  const fetchAttendees = async () => {
    try {
      const response = await api.get("/attendees");
      setAttendees(response.data);
    } catch (e) {}
  };
  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchTasks();
    fetchAttendees();
    fetchEvents();
  }, []);

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (e) {}
  };

  return (
    <div className="w-screen h-screen p-10">
      <div className="flex items-center justify-center">
        <p>Tasks</p>
      </div>
      <AddTaskDialog
        fetchTasks={fetchTasks}
        events={events}
        attendees={attendees}
      />

      <Table>
        <TableCaption>A list of Tasks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.name}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>{task.deadline}</TableCell>
              <TableCell>
                <Dialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DialogTrigger asChild>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                      </DialogTrigger>
                      <DropdownMenuItem
                        onSelect={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <EditTaskDialog
                    taskData={task}
                    fetchTasks={fetchTasks}
                    events={events}
                    attendees={attendees}
                  />
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Tasks;

const EditTaskDialog = ({ taskData, fetchTasks, events, attendees }) => {
  const [task, setTask] = useState(taskData);

  const handleEditTask = async () => {
    try {
      await api.put(`/tasks/${task.id}`, task);
      fetchTasks();
    } catch (e) {
      console.error("Failed to edit task:", e);
    }
  };

  return (
 

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={task.name}
              onChange={(e) => setTask({ ...task, name: e.target.value })}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="status">Status</Label>
            <Select
              value={task.status}
              onValueChange={(value) =>
                setTask({
                  ...task,
                  status: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={task.deadline}
              onChange={(e) => setTask({ ...task, deadline: e.target.value })}
            />
          </div>
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label>Events</Label>
          <Select
            value={task.event_id}
            onValueChange={(value) =>
              setTask({
                ...task,
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
        <div className="grid w-full items-center gap-1.5">
          <Label>Attendees</Label>
          <Select
            value={task.attendee_id}
            onValueChange={(value) =>
              setTask({
                ...task,
                attendee_id: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an attendee" />
            </SelectTrigger>
            <SelectContent>
              {attendees.map((attendee) => (
                <SelectItem key={attendee.id} value={attendee.id}>
                  {attendee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleEditTask}>Submit</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    
  );
};

const AddTaskDialog = ({ fetchTasks, events, attendees }) => {
  const [task, setTask] = useState({
    name: "",
    status: "",
    deadline: "",
    attendee_id: "",
    event_id: "",
  });

  const handleAddTask = async () => {
    try {
      await api.post("/tasks", task);
      fetchTasks();
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
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={task.name}
              onChange={(e) => setTask({ ...task, name: e.target.value })}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="status">Status</Label>

            <Select
              onValueChange={(value) =>
                setTask({
                  ...task,
                  status: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={task.deadline}
              onChange={(e) => setTask({ ...task, deadline: e.target.value })}
            />
          </div>
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label>Events</Label>
          <Select
            onValueChange={(value) =>
              setTask({
                ...task,
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
        <div className="grid w-full items-center gap-1.5">
          <Label>Attendees</Label>
          <Select
            onValueChange={(value) =>
              setTask({
                ...task,
                attendee_id: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an attendee" />
            </SelectTrigger>

            <SelectContent>
              {attendees.map((attendee) => (
                <SelectItem key={attendee.id} value={attendee.id}>
                  {attendee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleAddTask}>Submit</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
