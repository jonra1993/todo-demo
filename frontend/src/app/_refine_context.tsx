"use client";

import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import React from "react";

import routerProvider from "@refinedev/nextjs-router";

import "@/app/globals.css";
import { Toaster } from "@/components/refine-ui/notification/toaster";
import { useNotificationProvider } from "@/components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "@/components/refine-ui/theme/theme-provider";
import { authProviderClient } from "@providers/auth-provider/auth-provider.client";
import { dataProvider } from "@providers/data-provider";
import { liveProvider } from "@providers/live-provider";

type RefineContextProps = {
  children: React.ReactNode;
};

export const RefineContext = ({ children }: RefineContextProps) => {
  const notificationProvider = useNotificationProvider();

  return (
    <RefineKbarProvider>
      <ThemeProvider>
        <Refine
          authProvider={authProviderClient}
          dataProvider={dataProvider}
          notificationProvider={notificationProvider}
          routerProvider={routerProvider}
          liveProvider={liveProvider}
          resources={[
            {
              name: "dashboard",
              list: "/dashboard",
              meta: {
                label: "Overview",
              },
            },
            {
              name: "todo",
              list: "/dashboard/todos",
              create: "/dashboard/todos/create",
              edit: "/dashboard/todos/edit/:id",
              show: "/dashboard/todos/show/:id",
              meta: {
                canDelete: true,
                label: "Tareas",
                table: "todo",
              },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            liveMode: "auto",
            textTransformers: {
              plural: (text) => text,
            },
            title: {
              text: "Todo App",
              icon: null,
            },
          }}
        >
          {children}
          <Toaster />
          <RefineKbar />
        </Refine>
      </ThemeProvider>
    </RefineKbarProvider>
  );
};
