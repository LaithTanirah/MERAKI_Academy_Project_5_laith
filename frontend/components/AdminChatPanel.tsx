"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Paper,
  Divider,
} from "@mui/material";

const socket = io("http://localhost:5000");

interface Message {
  sender: string;
  message: string;
  roomId?: string;
}

export default function AdminChatPanel() {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.emit("join-room", { roomId: "admin-room", isAdmin: true });

    socket.on("receive-message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
      if (data.roomId && !users.includes(data.roomId)) {
        setUsers((prev) => [...prev, data.roomId!]);
      }
    });

    return () => {
      socket.off("receive-message");
    };
  }, [users]);

  const handleSend = () => {
    if (!message || !selectedUserId) return;

    const newMessage: Message = {
      sender: "admin",
      message,
      roomId: selectedUserId,
    };

    socket.emit("send-message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <Box display="flex" p={2} gap={3}>
      <Box>
        <Typography variant="h6">Users</Typography>
        <List>
          {users.map((userId) => (
            <ListItem
              key={userId}
              button
              onClick={() => setSelectedUserId(userId)}
              selected={selectedUserId === userId}
            >
              User ID: {userId}
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider orientation="vertical" flexItem />

      <Box flex={1}>
        <Typography variant="h6">
          Chat with User: {selectedUserId || "None"}
        </Typography>
        <Paper
          variant="outlined"
          sx={{ height: 300, overflowY: "auto", p: 1, mb: 2 }}
        >
          {messages
            .filter((msg) => msg.roomId === selectedUserId)
            .map((msg, i) => (
              <Typography key={i}>
                <strong>{msg.sender}:</strong> {msg.message}
              </Typography>
            ))}
        </Paper>

        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button variant="contained" onClick={handleSend}>
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
