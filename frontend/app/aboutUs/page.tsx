"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Container,
  Stack,
  ThemeProvider,
  createTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
} from "@mui/material";
import { GitHub, LinkedIn, Close } from "@mui/icons-material";

const theme = createTheme({
  typography: { fontFamily: "'Roboto', sans-serif" },
});

const teamMembers = [
  {
    name: "Mohammad",
    image: "/images/mohammad.jpg",
    shortBio: "Full‑Stack Developer | JS, NextJS, NodeJS, Express",
    fullBio: ` Mohammad is a skilled full-stack engineer known for his versatility in web development. With a strong foundation in both front-end and back-end technologies, he crafts dynamic and responsive applications that enhance user experience. Proficient in languages such as JavaScript, HTML, and CSS, as well as frameworks like Angular and Express, Mohammad seamlessly bridges the gap between design and functionality. His analytical mindset allows him to troubleshoot issues effectively, while his collaborative spirit fosters teamwork in agile environments. Passionate about continuous learning, Mohammad keeps abreast of emerging technologies.
`,
    socials: [
      {
        label: "GitHub",
        icon: <GitHub />,
        href: "https://github.com/MohmadZiad",
      },
      {
        label: "LinkedIn",
        icon: <LinkedIn />,
        href: "https://www.linkedin.com/in/mohmadali/",
      },
    ],
  },
  {
    name: "Laith",
    image: "/images/laith.jpeg",
    shortBio: "Full‑Stack Developer | JS, NextJS, NodeJS, Express",
    fullBio: ` Laith is a talented full-stack engineer with a passion for creating seamless web applications. With expertise in both front-end and back-end technologies, he excels in developing user-friendly interfaces and robust server-side logic. Laith is proficient in languages like JavaScript, Python, and Ruby, and frameworks such as React and Node.js. His problem-solving skills and attention to detail enable him to tackle complex challenges efficiently. Laith thrives in collaborative environments, often working closely with designers and product managers to deliver high-quality solutions. Always eager to learn, he stays updated with industry trends, ensuring his skills remain sharp and relevant.
`,
    socials: [
      {
        label: "GitHub",
        icon: <GitHub />,
        href: "https://github.com/LaithTanirah",
      },
      {
        label: "LinkedIn",
        icon: <LinkedIn />,
        href: "https://github.com/LaithTanirah",
      },
    ],
  },
  {
    name: "Hasan",
    image: "/images/Hasan_pic.jpg",
    shortBio: "Full‑Stack Developer | JS, NextJS, NodeJS, Express",
    fullBio: ` Hasan is a dedicated full-stack engineer with a knack for building efficient and scalable web applications. His expertise spans both front-end and back-end development, utilizing technologies like JavaScript, React, and Node.js. Hasan is known for his ability to create intuitive user interfaces while ensuring robust server-side functionality. With a strong focus on clean code and best practices, he consistently delivers high-quality solutions. Hasan thrives in collaborative settings, often engaging with cross-functional teams to bring projects to life. His passion for technology drives him to stay updated on industry trends, making him a valuable asset in any development team.`,
    socials: [
      {
        label: "GitHub",
        icon: <GitHub />,
        href: "https://github.com/HasanJabaie",
      },
      {
        label: "LinkedIn",
        icon: <LinkedIn />,
        href: "https://github.com/HasanJabaie",
      },
    ],
  },
];

// Slide transition for modal
const Transition = React.forwardRef(function Transition(props: any, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CARD = { width: 300, height: 380 };

export default function AboutUs() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleOpen = (member) => {
    setSelected(member);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #C8FACC, #5F7F67)",
          py: 6,
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            color="text.primary"
          >
            About Avocado
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: 1200,
              mx: "auto",
              mb: 4,
              px: 2,
              color: "#1e3c32",
              fontSize: "1.2rem",
              lineHeight: 1.6,
              fontFamily: "'Open Sans', sans-serif",
              textAlign: "justify",
            }}
          >
            Welcome to our company! <strong>Avocado</strong> is a cutting-edge
            delivery app designed to streamline the process of getting fresh
            produce and groceries right to your doorstep. With a user-friendly
            interface, Avocado allows customers to browse a wide selection of
            organic fruits, vegetables, and other essentials, ensuring that
            healthy choices are just a few taps away. The app prioritizes local
            farmers and suppliers, promoting sustainability and supporting the
            community while providing users with high-quality products.
            Avocado's efficient delivery system guarantees that items arrive
            quickly and in perfect condition, making it an ideal choice for busy
            individuals and families. Additionally, the app features
            personalized recommendations based on user preferences, enhancing
            the shopping experience. By combining convenience, quality, and a
            commitment to sustainability, Avocado is revolutionizing the way
            people access their groceries, making healthy living more accessible
            than ever.
          </Typography>

          <Typography
            variant="h4"
            align="center"
            gutterBottom
            color="text.primary"
          >
            Meet the Team
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              flexWrap: "wrap",
              mt: 3,
            }}
          >
            {teamMembers.map((m) => (
              <Box
                key={m.name}
                sx={{
                  width: CARD.width,
                  height: CARD.height,
                  cursor: "pointer",
                  boxShadow: 6,
                  borderRadius: 3,
                  overflow: "hidden",
                  background:
                    "linear-gradient(135deg,rgb(255, 255, 255),rgb(148, 190, 142))", // modern mint gradient
                  color: "#1e3c32",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                  ":hover": {
                    transform: "scale(1.05)",
                    boxShadow: 8,
                  },
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onClick={() => handleOpen(m)}
              >
                <Avatar
                  src={m.image}
                  alt={m.name}
                  sx={{ width: 110, height: 110, mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  {m.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  mb={2}
                >
                  {m.shortBio}
                </Typography>
                <Stack direction="row" spacing={1}>
                  {m.socials.map((soc, i) => (
                    <IconButton
                      key={i}
                      component="a"
                      href={soc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                    >
                      {soc.icon}
                    </IconButton>
                  ))}
                </Stack>
              </Box>
            ))}
          </Box>
        </Container>

        {/* Modal for full details */}
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background:
                "linear-gradient(135deg,rgb(219, 233, 217),rgb(148, 190, 142))",
            }}
          >
            {selected?.name}
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent
            dividers
            sx={{
              background:
                "linear-gradient(135deg,rgb(255, 255, 255),rgb(148, 190, 142))",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Avatar
                src={selected?.image}
                alt={selected?.name}
                sx={{ width: 120, height: 120, margin: "0 auto", mb: 2 }}
              />
              <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
                {selected?.socials.map((soc, i) => (
                  <IconButton
                    key={i}
                    component="a"
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="primary"
                  >
                    {soc.icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              {selected?.shortBio}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selected?.fullBio}
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{
              background:
                "linear-gradient(135deg,rgb(219, 233, 217),rgb(148, 190, 142))",
            }}
          >
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
