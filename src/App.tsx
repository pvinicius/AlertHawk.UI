import { FC, useEffect } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import appRoutes from "./router/Routes";
import getTheme from "./theme";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { useStoreActions, useStoreState } from "./hooks";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

const App: FC<{}> = () => {
  const { isDarkMode } = useStoreState((state) => state.app);
  const { setIsSmallScreen, setIsMediumScreen } = useStoreActions(
    (action) => action.app
  );

  const theme = getTheme(isDarkMode ? "dark" : "light");

  const isSmallScreenMediaQuery = useMediaQuery(theme.breakpoints.down("md"));
  const isMediumScreenMediaQuery = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    setIsSmallScreen(isSmallScreenMediaQuery);
  }, [isSmallScreenMediaQuery, setIsSmallScreen]);

  useEffect(() => {
    setIsMediumScreen(isMediumScreenMediaQuery);
  }, [isMediumScreenMediaQuery, setIsMediumScreen]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthenticatedTemplate>
          <Routes>
            {appRoutes.map((item, index) => (
              <Route key={index} path={item.path} element={item.element}>
                {item.childRoutes
                  ? item.childRoutes.map((jtem: any, jndex: any) => (
                      <Route
                        key={`j${jndex}`}
                        path={jtem.path}
                        element={jtem.element}
                      />
                    ))
                  : null}
              </Route>
            ))}
          </Routes>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </UnauthenticatedTemplate>
      </Router>{" "}
    </ThemeProvider>
  );
};

export default App;
