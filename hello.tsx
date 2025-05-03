// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { motion } from "framer-motion";

// type Tool = "brush" | "eraser" | "rectangle" | "circle" | "line";

// type DrawingAction = {
//   tool: Tool;
//   color: string;
//   size: number;
//   path?: { x: number; y: number }[];
//   startPoint?: { x: number; y: number };
//   endPoint?: { x: number; y: number };
// };

// export default function DrawingApp() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>(
//     []
//   );
//   const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
//     null
//   );

//   const [selectedTool, setSelectedTool] = useState<Tool>("brush");
//   const [color, setColor] = useState("#000000");
//   const [brushSize, setBrushSize] = useState(5);

//   const [actions, setActions] = useState<DrawingAction[]>([]);
//   const [history, setHistory] = useState<DrawingAction[][]>([[]]);
//   const [historyIndex, setHistoryIndex] = useState(0);

//   const [showColorPicker, setShowColorPicker] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [notifications, setNotifications] = useState<string[]>([]);
//   const [showToolsPanel, setShowToolsPanel] = useState(true);

//   const colorPalette = [
//     "#000000",
//     "#FFFFFF",
//     "#FF0000",
//     "#00FF00",
//     "#0000FF",
//     "#FFFF00",
//     "#FF00FF",
//     "#00FFFF",
//     "#FFA500",
//     "#800080",
//     "#008000",
//     "#800000",
//     "#008080",
//     "#808000",
//     "#FFC0CB",
//     "#A52A2A",
//     "#808080",
//     "#D3D3D3",
//   ];

//   // Set up canvas
//   useEffect(() => {
//     if (canvasRef.current) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");

//       if (ctx) {
//         setContext(ctx);
//         resizeCanvas();
//         window.addEventListener("resize", resizeCanvas);
//         return () => {
//           window.removeEventListener("resize", resizeCanvas);
//         };
//       }
//     }
//   }, []);

//   const resizeCanvas = () => {
//     if (!canvasRef.current) return;

//     const canvas = canvasRef.current;
//     const container = canvas.parentElement;

//     if (container) {
//       const tempImageData = context?.getImageData(
//         0,
//         0,
//         canvas.width,
//         canvas.height
//       );

//       canvas.width = container.clientWidth;
//       canvas.height = container.clientHeight;
//       const newCtx = canvas.getContext("2d");
//       if (newCtx) {
//         setContext(newCtx);
//         newCtx.lineCap = "round";
//         newCtx.lineJoin = "round";
//         if (tempImageData && canvas.width > 0 && canvas.height > 0) {
//           try {
//             newCtx.putImageData(tempImageData, 0, 0);
//           } catch (e) {
//             redrawCanvas(newCtx);
//           }
//         } else {
//           redrawCanvas(newCtx);
//         }
//       }
//     }
//   };

//   const redrawCanvas = (ctx: CanvasRenderingContext2D) => {
//     if (!canvasRef.current) return;
//     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//     actions.forEach((action) => {
//       ctx.strokeStyle = action.tool === "eraser" ? "#FFFFFF" : action.color;
//       ctx.lineWidth = action.size;
//       ctx.lineCap = "round";
//       ctx.lineJoin = "round";

//       if (action.path && action.path.length > 1) {
//         ctx.beginPath();
//         ctx.moveTo(action.path[0].x, action.path[0].y);

//         for (let i = 1; i < action.path.length; i++) {
//           ctx.lineTo(action.path[i].x, action.path[i].y);
//         }

//         ctx.stroke();
//       } else if (action.startPoint && action.endPoint) {
//         drawShape(
//           ctx,
//           action.tool,
//           action.startPoint,
//           action.endPoint,
//           action.color,
//           action.size
//         );
//       }
//     });
//   };

//   useEffect(() => {
//     if (context && canvasRef.current) {
//       redrawCanvas(context);
//     }
//   }, [actions, context]);

//   const addNotification = (message: string) => {
//     setNotifications((prev) => [...prev, message]);
//     setTimeout(() => {
//       setNotifications((prev) => prev.filter((n) => n !== message));
//     }, 3000);
//   };

//   const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!canvasRef.current || !context) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     setIsDrawing(true);
//     setStartPoint({ x, y });

//     if (selectedTool === "brush" || selectedTool === "eraser") {
//       setCurrentPath([{ x, y }]);
//       context.beginPath();
//       context.moveTo(x, y);
//       context.strokeStyle = selectedTool === "brush" ? color : "#FFFFFF";
//       context.lineWidth = brushSize;
//       context.lineCap = "round";
//       context.lineJoin = "round";
//     }
//   };

//   const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!isDrawing || !context || !canvasRef.current) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     if (selectedTool === "brush" || selectedTool === "eraser") {
//       // Update path for action history
//       setCurrentPath((prev) => [...prev, { x, y }]);

//       // Draw on canvas for immediate feedback
//       context.lineTo(x, y);
//       context.stroke();
//     } else if (startPoint) {
//       // For shapes, we need to redraw the canvas each time to show preview
//       const tempCanvas = document.createElement("canvas");
//       tempCanvas.width = canvasRef.current.width;
//       tempCanvas.height = canvasRef.current.height;
//       const tempCtx = tempCanvas.getContext("2d");

//       if (tempCtx) {
//         // First, draw all completed actions to temp canvas
//         redrawCanvas(tempCtx);

//         // Then draw the current shape preview
//         drawShape(
//           tempCtx,
//           selectedTool,
//           startPoint,
//           { x, y },
//           color,
//           brushSize
//         );

//         // Clear main canvas and copy from temp canvas
//         context.clearRect(
//           0,
//           0,
//           canvasRef.current.width,
//           canvasRef.current.height
//         );
//         context.drawImage(tempCanvas, 0, 0);
//       }
//     }
//   };

//   const endDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!isDrawing || !canvasRef.current || !context || !startPoint) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const endX = e.clientX - rect.left;
//     const endY = e.clientY - rect.top;

//     // Create the new action
//     let newAction: DrawingAction = {
//       tool: selectedTool,
//       color: color,
//       size: brushSize,
//     };

//     if (selectedTool === "brush" || selectedTool === "eraser") {
//       // For path-based tools, include the path points
//       const finalPath = [...currentPath, { x: endX, y: endY }];
//       newAction.path = finalPath;

//       // Finish the current stroke
//       context.lineTo(endX, endY);
//       context.stroke();
//     } else {
//       // For shape tools, include start and end points
//       newAction.startPoint = startPoint;
//       newAction.endPoint = { x: endX, y: endY };

//       // Draw the final shape
//       drawShape(
//         context,
//         selectedTool,
//         startPoint,
//         { x: endX, y: endY },
//         color,
//         brushSize
//       );
//     }

//     // Only add the action if something was actually drawn
//     // For shapes, check if start and end points are different
//     // For brush/eraser, check if path has more than 1 point
//     const isValidAction =
//       (newAction.path && newAction.path.length > 1) ||
//       (newAction.startPoint &&
//         newAction.endPoint &&
//         (newAction.startPoint.x !== newAction.endPoint.x ||
//           newAction.startPoint.y !== newAction.endPoint.y));

//     if (isValidAction) {
//       // Update actions with the new action
//       const updatedActions = [...actions, newAction];

//       // Update history - remove any future history (if we were in a previous state)
//       const newHistory = history.slice(0, historyIndex + 1);

//       // Add the updated actions to history
//       setHistory([...newHistory, JSON.parse(JSON.stringify(updatedActions))]);
//       setHistoryIndex(historyIndex + 1);

//       // Update the actions
//       setActions(updatedActions);
//     }

//     // Reset drawing state
//     setIsDrawing(false);
//     setCurrentPath([]);
//     setStartPoint(null);
//   };

//   const drawShape = (
//     ctx: CanvasRenderingContext2D,
//     tool: Tool,
//     start: { x: number; y: number },
//     end: { x: number; y: number },
//     color: string,
//     size: number
//   ) => {
//     ctx.beginPath();
//     ctx.strokeStyle = color;
//     ctx.lineWidth = size;
//     ctx.lineCap = "round";
//     ctx.lineJoin = "round";

//     if (tool === "rectangle") {
//       ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
//     } else if (tool === "circle") {
//       const radius = Math.sqrt(
//         Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
//       );
//       ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
//     } else if (tool === "line") {
//       ctx.moveTo(start.x, start.y);
//       ctx.lineTo(end.x, end.y);
//     }

//     ctx.stroke();
//   };

//   // Action handlers
//   const handleUndo = () => {
//     if (historyIndex > 0) {
//       setHistoryIndex(historyIndex - 1);
//       setActions(JSON.parse(JSON.stringify(history[historyIndex - 1])));
//       addNotification("Undo successful");
//     } else {
//       addNotification("Nothing to undo");
//     }
//   };

//   const handleRedo = () => {
//     if (historyIndex < history.length - 1) {
//       setHistoryIndex(historyIndex + 1);
//       setActions(JSON.parse(JSON.stringify(history[historyIndex + 1])));
//       addNotification("Redo successful");
//     } else {
//       addNotification("Nothing to redo");
//     }
//   };

//   const handleClearCanvas = () => {
//     // Update history
//     const newHistory = history.slice(0, historyIndex + 1);

//     setHistory([...newHistory, []]);
//     setHistoryIndex(historyIndex + 1);
//     setActions([]);

//     // Clear the canvas
//     if (context && canvasRef.current) {
//       context.clearRect(
//         0,
//         0,
//         canvasRef.current.width,
//         canvasRef.current.height
//       );
//     }

//     addNotification("Canvas cleared");
//   };

//   const handleExportImage = () => {
//     if (!canvasRef.current) return;

//     const link = document.createElement("a");
//     link.download = "drawing.png";
//     link.href = canvasRef.current.toDataURL("image/png");
//     link.click();

//     addNotification("Drawing saved as PNG");
//   };

//   const handleCloseWelcome = () => {
//     setShowWelcome(false);
//     // Force canvas resize after welcome screen is closed
//     setTimeout(resizeCanvas, 100);
//   };

//   if (showWelcome) {
//     return (
//       <div className="flex h-screen bg-gray-900 text-white">
//         <div className="m-auto max-w-2xl p-8 rounded-lg bg-gray-800 shadow-2xl">
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
//               Canvas Studio
//             </h1>

//             <div className="space-y-6">
//               <p className="text-lg text-center">
//                 Create stunning digital artwork with our intuitive drawing
//                 canvas.
//               </p>

//               <div className="grid grid-cols-3 gap-4 my-8">
//                 <div className="bg-gray-700 p-4 rounded-lg text-center">
//                   <svg
//                     className="w-12 h-12 mx-auto mb-2 text-blue-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
//                     />
//                   </svg>
//                   <h3 className="font-semibold">Drawing Tools</h3>
//                   <p className="text-sm text-gray-300">
//                     Brush, shapes, eraser and more
//                   </p>
//                 </div>

//                 <div className="bg-gray-700 p-4 rounded-lg text-center">
//                   <svg
//                     className="w-12 h-12 mx-auto mb-2 text-purple-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                     />
//                   </svg>
//                   <h3 className="font-semibold">Export Options</h3>
//                   <p className="text-sm text-gray-300">
//                     Save your work as images
//                   </p>
//                 </div>

//                 <div className="bg-gray-700 p-4 rounded-lg text-center">
//                   <svg
//                     className="w-12 h-12 mx-auto mb-2 text-green-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M10 19l-7-7m0 0l7-7m-7 7h18"
//                     />
//                   </svg>
//                   <h3 className="font-semibold">History</h3>
//                   <p className="text-sm text-gray-300">Undo and redo changes</p>
//                 </div>
//               </div>

//               <h3 className="font-semibold text-lg mb-2">Features:</h3>
//               <ul className="grid grid-cols-2 gap-2 mb-6">
//                 <li className="flex items-center">
//                   <svg
//                     className="w-5 h-5 mr-2 text-green-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                   Freehand Drawing
//                 </li>
//                 <li className="flex items-center">
//                   <svg
//                     className="w-5 h-5 mr-2 text-green-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                   Shape Tools
//                 </li>
//                 <li className="flex items-center">
//                   <svg
//                     className="w-5 h-5 mr-2 text-green-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                   Color Palette
//                 </li>
//                 <li className="flex items-center">
//                   <svg
//                     className="w-5 h-5 mr-2 text-green-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                   Adjustable Brush Size
//                 </li>
//               </ul>

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleCloseWelcome}
//                 className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300"
//               >
//                 Start Drawing
//               </motion.button>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
//       {/* Header */}
//       <header className="bg-gray-800 border-b border-gray-700 shadow-md py-2 px-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <svg
//               className="w-8 h-8 text-blue-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
//               />
//             </svg>
//             <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
//               Canvas Studio
//             </h1>
//           </div>

//           <div className="flex items-center space-x-3">
//             <button
//               onClick={handleExportImage}
//               className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 rounded transition-colors duration-200"
//             >
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                 />
//               </svg>
//               <span>Save as PNG</span>
//             </button>

//             <button
//               onClick={() => setShowToolsPanel(!showToolsPanel)}
//               className="p-1 hover:bg-gray-700 rounded transition-colors duration-200"
//               title={showToolsPanel ? "Hide Tools" : "Show Tools"}
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
//                 />
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Left Sidebar - Tools */}
//         {showToolsPanel && (
//           <motion.div
//             initial={{ x: -300 }}
//             animate={{ x: 0 }}
//             className="w-56 bg-gray-800 border-r border-gray-700 p-4 flex flex-col"
//           >
//             <h2 className="text-lg font-semibold mb-4">Drawing Tools</h2>

//             <div className="grid grid-cols-2 gap-2 mb-6">
//               <button
//                 className={`p-2 rounded flex flex-col items-center text-xs ${
//                   selectedTool === "brush"
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-700 hover:bg-gray-600"
//                 }`}
//                 onClick={() => setSelectedTool("brush")}
//               >
//                 <svg
//                   className="w-6 h-6 mb-1"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
//                   />
//                 </svg>
//                 Brush
//               </button>

//               <button
//                 className={`p-2 rounded flex flex-col items-center text-xs ${
//                   selectedTool === "eraser"
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-700 hover:bg-gray-600"
//                 }`}
//                 onClick={() => setSelectedTool("eraser")}
//               >
//                 <svg
//                   className="w-6 h-6 mb-1"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                   />
//                 </svg>
//                 Eraser
//               </button>

//               <button
//                 className={`p-2 rounded flex flex-col items-center text-xs ${
//                   selectedTool === "rectangle"
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-700 hover:bg-gray-600"
//                 }`}
//                 onClick={() => setSelectedTool("rectangle")}
//               >
//                 <svg
//                   className="w-6 h-6 mb-1"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
//                   />
//                 </svg>
//                 Rectangle
//               </button>

//               <button
//                 className={`p-2 rounded flex flex-col items-center text-xs ${
//                   selectedTool === "circle"
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-700 hover:bg-gray-600"
//                 }`}
//                 onClick={() => setSelectedTool("circle")}
//               >
//                 <svg
//                   className="w-6 h-6 mb-1"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <circle cx="12" cy="12" r="10" strokeWidth="2" />
//                 </svg>
//                 Circle
//               </button>

//               <button
//                 className={`p-2 rounded flex flex-col items-center text-xs ${
//                   selectedTool === "line"
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-700 hover:bg-gray-600"
//                 }`}
//                 onClick={() => setSelectedTool("line")}
//               >
//                 <svg
//                   className="w-6 h-6 mb-1"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 20L20 4"
//                   />
//                 </svg>
//                 Line
//               </button>
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium mb-2">
//                 Brush Size: {brushSize}px
//               </label>
//               <input
//                 type="range"
//                 min="1"
//                 max="50"
//                 value={brushSize}
//                 onChange={(e) => setBrushSize(parseInt(e.target.value))}
//                 className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
//               />
//             </div>

//             <div className="mb-6">
//               <div className="flex justify-between items-center mb-2">
//                 <label className="block text-sm font-medium">Color</label>
//                 <div
//                   className="w-8 h-8 rounded-full border-2 border-white cursor-pointer"
//                   style={{ backgroundColor: color }}
//                   onClick={() => setShowColorPicker(!showColorPicker)}
//                 />
//               </div>

//               {showColorPicker && (
//                 <div className="bg-gray-700 p-2 rounded-lg shadow-lg">
//                   <div className="grid grid-cols-6 gap-1 mb-2">
//                     {colorPalette.map((paletteColor) => (
//                       <div
//                         key={paletteColor}
//                         className={`w-6 h-6 rounded-full cursor-pointer border ${
//                           color === paletteColor
//                             ? "border-white"
//                             : "border-transparent"
//                         }`}
//                         style={{ backgroundColor: paletteColor }}
//                         onClick={() => {
//                           setColor(paletteColor);
//                           setShowColorPicker(false);
//                         }}
//                       />
//                     ))}
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="color"
//                       value={color}
//                       onChange={(e) => setColor(e.target.value)}
//                       className="w-full h-8 rounded cursor-pointer"
//                     />
//                     <button
//                       onClick={() => setShowColorPicker(false)}
//                       className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="mt-auto space-y-2">
//               <button
//                 onClick={handleUndo}
//                 className="w-full py-2 px-4 flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors duration-200"
//                 disabled={historyIndex <= 0}
//               >
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M10 19l-7-7m0 0l7-7m-7 7h18"
//                   />
//                 </svg>
//                 <span className="text-sm">Undo</span>
//               </button>

//               <button
//                 onClick={handleRedo}
//                 className="w-full py-2 px-4 flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors duration-200"
//                 disabled={historyIndex >= history.length - 1}
//               >
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M14 5l7 7m0 0l-7 7m7-7H3"
//                   />
//                 </svg>
//                 <span className="text-sm">Redo</span>
//               </button>

//               <button
//                 onClick={handleClearCanvas}
//                 className="w-full py-2 px-4 flex items-center justify-center space-x-2 bg-red-700 hover:bg-red-600 rounded transition-colors duration-200"
//               >
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                   />
//                 </svg>
//                 <span className="text-sm">Clear Canvas</span>
//               </button>
//             </div>
//           </motion.div>
//         )}

//         {/* Main Canvas Area */}
//         <main className="flex-1 relative bg-white">
//           <canvas
//             ref={canvasRef}
//             className="w-full h-full cursor-crosshair"
//             onMouseDown={startDrawing}
//             onMouseMove={draw}
//             onMouseUp={endDrawing}
//             onMouseLeave={endDrawing}
//           />

//           {/* Current Tool Indicator */}
//           <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-75 text-white py-1 px-3 rounded-full text-sm flex items-center space-x-2">
//             <span>
//               {selectedTool === "brush"
//                 ? "Brush"
//                 : selectedTool === "eraser"
//                 ? "Eraser"
//                 : selectedTool === "rectangle"
//                 ? "Rectangle"
//                 : selectedTool === "circle"
//                 ? "Circle"
//                 : "Line"}
//             </span>
//             <div
//               className="w-4 h-4 rounded-full"
//               style={{
//                 backgroundColor: selectedTool === "eraser" ? "#FFFFFF" : color,
//               }}
//             />
//             <span>{brushSize}px</span>
//           </div>

//           {/* Notifications */}
//           <div className="absolute top-4 right-4 space-y-2">
//             {notifications.map((notification, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0 }}
//                 className="bg-gray-800 bg-opacity-75 text-white py-2 px-4 rounded-md text-sm"
//               >
//                 {notification}
//               </motion.div>
//             ))}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
