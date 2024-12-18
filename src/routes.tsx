import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Login from "./pages/signin/Login";
import CreateWallet from "./pages/signin/CreateWallet";
import ImportWallet from "./pages/signin/ImportWallet";
import Home from "./pages/Home";
import { MainLayout } from "./components/layout/MainLayout";
import { Library } from "./pages/Library";
import { GameDetail } from "./pages/game_detail/GameDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/create_wallet",
    element: <CreateWallet />,
  },
  {
    path: "/import_wallet",
    element: <ImportWallet />,
  },
  {
    path: "/home",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "library",
        element: <Library />,
      },
      {
        path: ":game",
        element: <GameDetail />,
      },
    ],
  },
]);

export default router;
