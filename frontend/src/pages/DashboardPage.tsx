import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Container
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from "../context/AuthContext";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StorageIcon from "@mui/icons-material/Storage";
import { usePageTitle } from '../hooks/usePageTitle';

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const { userInfo, shiftInfo } = useAuth();
  const { setPageTitle, resetPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle("Trang chủ");
    return () => {
      resetPageTitle();
    };
  }, [setPageTitle, resetPageTitle]);

  const getDbName = (mabc: string) => {
    switch (mabc) {
      case "100916": return "Hà Nội KT Liên Tỉnh";
      case "101000": return "Hà Nội KT Nội Tỉnh";
      default: return "";
    }
  };

  const cards = [
    {
      title: "Thông tin người dùng",
      icon: <PeopleIcon fontSize="large" color="primary" />,
      content: [
        { label: "Tên người dùng", value: userInfo?.username },
        { label: "Vai trò", value: userInfo?.role === 9 ? "Admin" : "Người dùng" }
      ]
    },
    {
      title: "Ca làm việc",
      icon: <AccessTimeIcon fontSize="large" color="primary" />,
      content: [
        { label: "Ca hiện tại", value: shiftInfo?.ca },
        { label: "Ngày", value: shiftInfo?.ngaykt }
      ]
    },
    {
      title: "Trung Tâm Khai Thác Trong Nước",
      icon: <StorageIcon fontSize="large" color="primary" />,
      content: [
        { label: "Database", value: shiftInfo?.db },
        { label: "Đơn vị", value: getDbName(userInfo?.mabc || "") }
      ]
    }
  ];

  return (
    <Container maxWidth={false} sx={{ height: '100%', py: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
        Tổng quan hệ thống
      </Typography>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        },
        gap: 3
      }}>
        {cards.map((card, index) => (
          <Card 
            key={index}
            elevation={2}
            sx={{ 
              height: "fit-content",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[8]
              }
            }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "primary.light" }}>
                  {card.icon}
                </Avatar>
              }
              title={<Typography variant="h6">{card.title}</Typography>}
            />
            <CardContent>
              {card.content.map((item, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Typography color="textSecondary" variant="body2">
                    {item.label}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    {item.value || "N/A"}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default DashboardPage;
