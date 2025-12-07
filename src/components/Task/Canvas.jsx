import React, { useRef, useState, useEffect } from "react";
import { Button, Input, Select, MenuItem } from '@mui/material';
import io from 'socket.io-client';
import $ from "jquery"; // Reintroduce jQuery
import './canvas.css';

const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;


// Connect to the server
const socket = io(CLIENT_URL); // Adjust the URL as needed

export default function Canvas({ taskId, userId }) {
    console.log(CLIENT_URL);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#3B3B3B");
    const [size, setSize] = useState("3");
    const canvasRef = useRef(null);
    const ctx = useRef(null);
    const timeout = useRef(null);
    const [cursor, setCursor] = useState("default");
    const sidebarWidth = 270; // Adjust this to your sidebar width

    useEffect(() => {
        const canvas = canvasRef.current;
        ctx.current = canvas.getContext("2d");

        // Resizing
        // Function to resize canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth - sidebarWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();

        // Load from localStorage
        const canvasimg = localStorage.getItem("canvasimg");
        if (canvasimg) {
            var image = new Image();
            image.onload = function () {
                ctx.current.drawImage(image, 0, 0);
                setIsDrawing(false);
            };
            image.src = canvasimg;
        }

        // Join the room for the task
        socket.emit('joinTask', { taskId, userId });

        // Handle real-time whiteboard updates
        socket.on('updateWhiteboard', (whiteboardContent) => {
            const image = new Image();
            image.onload = function () {
                ctx.current.drawImage(image, 0, 0);
            };
            image.src = whiteboardContent;
        });


        // Listen for canvas cleared event
        socket.on('canvasCleared', () => {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
            localStorage.removeItem("canvasimg");
        });

        window.addEventListener('resize', resizeCanvas);

        return () => {
            socket.off('updateWhiteboard');
            socket.off('canvasCleared');
            socket.emit('leaveTask', { taskId, userId });
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [taskId, userId]);

    const startPosition = ({ nativeEvent }) => {
        setIsDrawing(true);
        draw(nativeEvent);
    };

    const finishedPosition = () => {
        setIsDrawing(false);
        ctx.current.beginPath();
        // Emit the whiteboard update to the server
        const base64ImageData = canvasRef.current.toDataURL("image/png");
        socket.emit('whiteboardUpdate', { taskId, whiteboardContent: base64ImageData });
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) {
            return;
        }
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect(); // Get the canvas's position relative to the viewport
        const x = nativeEvent.clientX - rect.left; // Calculate the X position relative to the canvas
        const y = nativeEvent.clientY - rect.top;  // Calculate the Y position relative to the canvas

        ctx.current.lineWidth = size;
        ctx.current.lineCap = "round";
        ctx.current.strokeStyle = color;

        ctx.current.lineTo(x, y);
        ctx.current.stroke();
        ctx.current.beginPath();
        ctx.current.moveTo(x, y);

        // Save the canvas state after drawing
        if (timeout.current !== undefined) clearTimeout(timeout.current);
        timeout.current = setTimeout(function () {
            const base64ImageData = canvasRef.current.toDataURL("image/png");
            localStorage.setItem("canvasimg", base64ImageData);
        }, 400);
    };

    const clearCanvas = () => {
        localStorage.removeItem("canvasimg");
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // // Emit the clear canvas update to the server
        // const base64ImageData = canvas.toDataURL("image/png");
        // socket.emit('whiteboardUpdate', { taskId, whiteboardContent: base64ImageData });


        // Emit clear canvas event to server
        socket.emit('clearCanvas', taskId);
    };

    const getPen = () => {
        setCursor("default");
        setSize("3");
        setColor("#3B3B3B");
    };

    const eraseCanvas = () => {
        setCursor("grab");
        setSize("20");
        setColor("#FFFFFF");
        $("#circularcursor").show();
        $(document).on("mousemove", function (e) {
            $("#circularcursor").css({
                left: e.pageX,
                top: e.pageY,
            });
        });

        if (!isDrawing) {
            return;
        }
    };

    return (
        <>
            <div className="canvas-btn">
                <Button onClick={getPen} className="btn-width">
                    Pencil
                </Button>
                <div className="btn-width">
                    <Input
                        className="color-picker"
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                </div>
                <div>
                    <Select

                        className="btn-width size-selector"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                    >
                        {[1, 3, 5, 10, 15, 20, 25, 30].map(size => (
                            <MenuItem key={size} value={size}>{size}</MenuItem>
                        ))}
                    </Select>
                </div>
                <Button onClick={clearCanvas} className="btn-width">
                    Clear
                </Button>
                <div>
                    <Button onClick={eraseCanvas} className="btn-width">
                        Erase
                    </Button>
                </div>
            </div>
            <canvas
                className="canvas-style"
                style={{ cursor: cursor}}
                onMouseDown={startPosition}
                onMouseUp={finishedPosition}
                onMouseMove={draw}
                ref={canvasRef}
            />
        </>
    );
}
