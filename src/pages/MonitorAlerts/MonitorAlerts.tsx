import { FC, useEffect, useState } from "react";
import MonitorAlertService from "../../services/MonitorAlertsService";
import { IMonitorAlerts } from "../../interfaces/IMonitorAlerts";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useParams } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { HelmetProvider, Helmet } from "react-helmet-async";
import logging from "../../utils/logging";

interface IMonitorAlertsProps {}
interface IHeaderCell {
  id: string;
  label: string;
  width?: string;
  sortable: boolean;
  align?: "left" | "center" | "right" | "justify" | "inherit";
}

const MonitorAlerts: FC<IMonitorAlertsProps> = () => {
  const [monitorAlerts, setMonitorAlerts] = useState<IMonitorAlerts[]>([]);
  const [monitorId, setMonitorId] = useState<number>(0);
  const { t } = useTranslation("global");
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchMonitorAlerts = async () => {
      try {
        if (id) {
          setMonitorId(parseInt(id));
        }
        const response = id
          ? await MonitorAlertService.get(parseInt(id))
          : await MonitorAlertService.get(monitorId);
        setMonitorAlerts(response);
      } catch (error) {
        logging.error(error);
      }
    };
    fetchMonitorAlerts();
  }, [id, monitorId]);

  const handleExport = async () => {
    try {
      const response = await MonitorAlertService.getReport(monitorId);
      const blob =response.data;
      
      if (blob.size === 0) {
        throw new Error('Received empty file.');
      }
  
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'AlertReport.xlsx'); // Adjust the filename as needed
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  const headerCells: readonly IHeaderCell[] = [
    {
      id: "timeStamp",
      label: t("monitorAlerts.timeStamp"),
      sortable: false,
    },
    {
      id: "monitorName",
      label: t("monitorAlerts.monitorName"),
      sortable: true,
    },
    {
      id: "monitorMessage",
      label: t("monitorAlerts.message"),
      sortable: true,
    },
    {
      id: "screenshot",
      label: t("monitorAlerts.screenshot"),
      width: "220px",
      sortable: true,
    },
  ];

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>AlertHawk | {t("users.text")}</title>
        </Helmet>
      </HelmetProvider>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <Button variant="contained" onClick={handleExport}>
                  Export
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {monitorAlerts.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        {headerCells.map((headerCell: IHeaderCell) => (
                          <TableCell key={headerCell.id}>
                            {headerCell.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {monitorAlerts.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell>
                            {moment(alert.timeStamp).format("DD/MM/YYYY HH:mm:ss")}
                          </TableCell>
                          <TableCell>{alert.monitorName}</TableCell>
                          <TableCell>{alert.message}</TableCell>
                          <TableCell>
                            {alert.screenShotUrl != null ? (
                              <a
                                href={alert.screenShotUrl}
                                style={{
                                  textDecoration: "none",
                                  color: "unset",
                                }}
                              >
                                Download
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (<p>{t("monitorAlerts.noResultFoundFor")}</p>)}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
export default MonitorAlerts;
