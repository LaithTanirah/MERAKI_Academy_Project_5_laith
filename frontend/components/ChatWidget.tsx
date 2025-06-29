"use client";

import { useEffect, useState, useRef } from "react";
import {
  Box, IconButton, Paper, TextField, Button, Typography, useTheme, Badge, List,
  ListItem, Chip, Avatar, Divider, Dialog, DialogTitle, DialogActions
} from "@mui/material";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  userId: string;
  role?: string;
}

interface ChatMessage {
  sender: "user" | "admin";
  message: string;
  roomId?: string;
}

interface UserData {
  id: string;
  name: string;
  role: "Customer" | "Delivery" | "Admin";
  avatar?: string;
}

export default function AdvancedChatWidget() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [unread, setUnread] = useState(0);
  const [typing, setTyping] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar" | null>(null);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const socketRef = useRef<any>();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [userId, setUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const suggestions = language === "ar"
    ? ["وين طلبي؟", "بدي أرجّع منتج", "في مشكلة بالخصم"]
    : ["Where is my order?", "I want to return a product", "There is a problem with the discount"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { userId, role } = jwtDecode<TokenPayload>(token);
        setUserId(userId);
        if (role === "admin") setIsAdmin(true);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!userId || isAdmin || !language) return;

    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    // fetch user data from your backend
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch(console.error);

    socket.emit("join-room", { roomId: userId, isAdmin: false });

    const welcomeMsg =
      language === "ar"
        ? "أهلًا بك في أفوكادو! 👋 كيف يمكننا مساعدتك اليوم؟"
        : "Welcome to Avocado! 👋 How can we help you today?";
    setChat((prev) => [...prev, { sender: "admin", message: welcomeMsg, roomId: userId }]);

    socket.on("receive-message", (msg: ChatMessage) => {
      setChat((prev) => {
        if (prev.length && prev[prev.length - 1].message === msg.message) return prev;
        return [...prev, msg];
      });
      setUnread((prev) => prev + 1);

      const lower = msg.message.toLowerCase();
      let autoReply = "";

      if (language === "en") {
        if (lower.includes("order")) autoReply = "Let me check that for you... Can you provide your order number?";
        else if (lower.includes("return")) autoReply = "Sorry to hear that! Please tell us the product you want to return.";
        else if (lower.includes("discount") || lower.includes("promo")) autoReply = "I see. Can you let us know what discount code you used?";
        else if (lower.includes("problem") || lower.includes("issue")) autoReply = "We're here to help! Can you describe the issue in more detail?";
        else if (lower.includes("hello") || lower.includes("hi")) autoReply = "Hello! 👋 How can I assist you today?";
        else if (lower.includes("thanks")) autoReply = "You're welcome! 😊 Let me know if there's anything else I can help with.";
      } else {
        if (lower.includes("طلبي")) autoReply = "ثواني من فضلك، هل يمكنك تزويدنا برقم الطلب؟";
        else if (lower.includes("ارجاع") || lower.includes("ترجيع")) autoReply = "نعتذر لسماع ذلك! ما هو المنتج الذي ترغب في إرجاعه؟";
        else if (lower.includes("خصم") || lower.includes("كود")) autoReply = "يرجى تزويدنا بكود الخصم الذي استخدمته.";
        else if (lower.includes("مشكلة")) autoReply = "نحن هنا للمساعدة! يرجى شرح المشكلة بالتفصيل.";
        else if (lower.includes("مرحبا") || lower.includes("اهلا")) autoReply = "مرحبًا بك! كيف يمكننا مساعدتك اليوم؟";
        else if (lower.includes("شكرا")) autoReply = "العفو! 😊 هل يوجد شيء آخر يمكننا مساعدتك به؟";
      }

      if (autoReply) {
        setTimeout(() => {
          setChat((prev) => [
            ...prev,
            { sender: "admin", message: autoReply, roomId: userId },
          ]);
        }, 1000);
      }
    });

    socket.on("typing", () => setTyping(true));
    socket.on("stop-typing", () => setTyping(false));

    return () => socket.disconnect();
  }, [userId, isAdmin, language]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed || !socketRef.current) return;
    const newMsg: ChatMessage = {
      sender: "user",
      message: trimmed,
      roomId: userId,
    };
    socketRef.current.emit("send-message", newMsg);
    setChat((prev) => [...prev, newMsg]);
    setMessage("");
  };

  const sendSuggestion = (text: string) => setMessage(text);

  if (isAdmin) return null;

  return (
    <>
      <Dialog open={showLanguageDialog}>
        <DialogTitle sx={{ textAlign: "center" }}>اختر اللغة / Choose Language</DialogTitle>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={() => {
              setLanguage("ar");
              setShowLanguageDialog(false);
              setOpen(true);
            }}
            variant="contained"
          >
            العربية
          </Button>
          <Button
            onClick={() => {
              setLanguage("en");
              setShowLanguageDialog(false);
              setOpen(true);
            }}
            variant="outlined"
          >
            English
          </Button>
        </DialogActions>
      </Dialog>

      <Badge color="error" badgeContent={unread} invisible={unread === 0}>
        <IconButton
          onClick={() => {
            setUnread(0);
            if (!language) {
              setShowLanguageDialog(true);
            } else {
              setOpen(true);
            }
          }}
          sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1300 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            transition={{ repeat: Infinity, repeatDelay: 10 }}
          >
            💬
          </motion.div>
        </IconButton>
      </Badge>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1300 }}
          >
            <Paper
              elevation={8}
              sx={{
                width: 360,
                height: 500,
                display: "flex",
                flexDirection: "column",
                p: 2,
                borderRadius: 4,
                bgcolor: theme.palette.mode === "dark" ? "#1a1a1a" : "#fff",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar src={userData?.avatar}>{userData?.name?.charAt(0) ?? "U"}</Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {userData?.name || "Guest"}
                    </Typography>
                    <Chip label={userData?.role || "Customer"} size="small" />
                  </Box>
                </Box>
                <Button size="small" color="error" onClick={() => setOpen(false)}>
                  ✖
                </Button>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ flex: 1, overflowY: "auto", mb: 1 }}>
                {chat.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: msg.sender === "admin" ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: msg.sender === "admin" ? "flex-end" : "flex-start",
                        mb: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexDirection: msg.sender === "admin" ? "row-reverse" : "row",
                        }}
                      >
                        <Avatar sx={{ bgcolor: msg.sender === "admin" ? "#3949ab" : "#66bb6a" }}>
                          {msg.sender === "admin" ? "A" : (userData?.name?.charAt(0) ?? "U")}
                        </Avatar>
                        <Box
                          sx={{
                            maxWidth: "75%",
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            bgcolor: msg.sender === "admin" ? theme.palette.grey[200] : "#A5D6A7",
                            color: "black",
                          }}
                        >
                          {msg.message}
                        </Box>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
                <div ref={bottomRef} />
              </Box>

              {typing && (
                <Typography variant="caption" sx={{ mt: 0.5 }}>
                  {language === "ar" ? "المشرف يكتب..." : "Admin is typing..."}
                </Typography>
              )}

              <List sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                {suggestions.map((s, i) => (
                  <ListItem key={i} sx={{ p: 0 }}>
                    <Chip label={s} onClick={() => sendSuggestion(s)} sx={{ borderRadius: 5 }} />
                  </ListItem>
                ))}
              </List>

              <TextField
                fullWidth
                size="small"
                placeholder={language === "ar" ? "اكتب رسالتك..." : "Type your message..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button
                variant="contained"
                fullWidth
                size="small"
                sx={{ mt: 1, borderRadius: 2 }}
                onClick={sendMessage}
              >
                {language === "ar" ? "إرسال" : "Send"}
              </Button>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
