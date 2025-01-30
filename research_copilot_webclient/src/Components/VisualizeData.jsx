import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { Gauge } from "@mui/x-charts/Gauge";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { Container, Box, Paper, Typography, Card } from "@mui/material";
import Grid from '@mui/material/Grid2';
import "../Styles/visualizeData.css";
import noDataIcon from "../Images/noData.svg";

const CardComponent = ({ title, value }) => {
  return (
    <Paper
      elevation={3}
      style={{ margin: "5px 16px 16px 16px", padding: 16, minWidth: 100, textAlign: "center", borderRadius: "0px" }}
    >
      <div>
        <h3
          style={{ fontWeight: "bold", color: "#092E5D" }}
        >
          {title}
        </h3>
      </div>
      <div>
        <h3 style={{ color: "#1B4A8D" }}>
          {value}
        </h3>
      </div>
    </Paper>
  );
};

const numOfPaperPublisedinYear = (data, width, height) => {
  // Extract years and count the number of papers for each year
  const yearCounts = data.reduce((acc, paper) => {
    const year = paper.year;
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  // Create xAxis and series data
  const xAxisData = Object.keys(yearCounts);
  const seriesData = Object.values(yearCounts);

  return (
    <Container>
      <BarChart
        xAxis={[{ scaleType: "band", data: xAxisData }]}
        series={[{ data: seriesData, label: "Number of Papers Published per Year", color: "#092E5D" }]}
        height={height}
        slotProps={{ legend: { hidden: false } }}
      />
    </Container>
  );
};

const generateShades = (baseColor, factor) => {
  const shades = [
    baseColor,            // Primary color
    "#1B4A8D",           // Slightly lighter
    "#4A6FA5",           // Even lighter
    "#6D8FBF",           // Soft pastel blue
    "#8EA5CF"            // Lightest blue
  ];
  return shades[factor % shades.length];
};

const venueCounts = (data, height) => {
  // Extract venue counts from the data
  const venueCounts = data.reduce((acc, paper) => {
    const venue = paper.venue;
    acc[venue] = (acc[venue] || 0) + 1;
    return acc;
  }, {});

  // Create series data for the pie chart
  const seriesData = Object.keys(venueCounts).map((venue, index) => ({
    id: index,
    value: venueCounts[venue],
    label: venue,
    color: generateShades("#092E5D", index)
  }));

  return (
    <Container align="center" sx={{ padding: "10px" }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#092E5D" }}>
        Distribution of Papers by Venue
      </Typography>
      <PieChart
        series={[
          {
            data: seriesData,
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
          },
        ]}
        height={height}
        slotProps={{ legend: { hidden: false } }}
      />
    </Container>
  );
};

const visualizeFieldOfStudy = (data, width, height) => {
  const fieldCounts = data.reduce((acc, paper) => {
    if (paper.fieldsOfStudy && Array.isArray(paper.fieldsOfStudy)) {
      paper.fieldsOfStudy.forEach((field) => {
        acc[field] = (acc[field] || 0) + 1;
      });
    }
    return acc;
  }, {});

  const seriesData = Object.keys(fieldCounts).map((field, index) => ({
    id: index,
    value: fieldCounts[field],
    label: field,
  }));

  return (
    <Container>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#092E5D" }}>
        Distribution of Fields of Study
      </Typography>
      <PieChart
        // series={[{ data: seriesData }]}
        series={[
          {
            data: seriesData.map((item, index) => ({
              ...item,
              color: generateShades("#092E5D", index) // Generate colors dynamically
            })),
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            innerRadius: 30,
            outerRadius: 100,
            paddingAngle: 2
          }
        ]}
        width={width}
        height={height}
        slotProps={{ legend: { hidden: false } }}
      />
    </Container>
  );
};

const titlesandInfluentialCitationCount = (data, width, height) => {
  // Extract paper titles and their influential citation counts
  const titles = data.map((paper) => paper.title);
  const citationCounts = data.map((paper) => paper.influentialCitationCount);

  return (
    <Container>
      <LineChart
        xAxis={[{ scaleType: "point", data: titles }]}
        series={[{ data: citationCounts, label: "Influential Citations of Paper Titles", color: "#092E5D" }]}
        height={height}
      />
    </Container>
  );
};

const paperTitlesandReferenceCounts = (data, width, height) => {
  // Extract paper titles and their reference counts
  const titles = data.map((paper) => paper.title);
  const referenceCounts = data.map((paper) => paper.referenceCount);

  return (
    <Container>
      <LineChart
        xAxis={[{ scaleType: "point", data: titles }]}
        series={[{ data: referenceCounts, label: "References of each paper", color: "#092E5D" }]}
        width={width}
        height={height}
      />
    </Container>
  );
};

const authorPaperCount = (data, width, height) => {
  if (!data || !Array.isArray(data)) return null;

  const authors = data.flatMap((paper) => paper.authors).filter(Boolean);
  if (authors.length === 0) return null;

  const seriesData = authors.map((author, index) => ({
    x: author.name || `Author ${index + 1}`,
    y: author.paperCount || 0,
  }));

  return (
    <Container>
      <ScatterChart
        xAxis={[{ scaleType: "point", data: seriesData.map((d) => d.x) }]}
        series={[{ data: seriesData.map((d) => ({ x: d.x, y: d.y })), label: "Paper Counts by Authors", color: "#092E5D" }]}
        height={height}
      />
    </Container>
  );
};


function VisualizeData(props) {
  const { searchData } = props;
  const [totalPapers, setTotalPapers] = useState(0);
  const [totalInfluentialCitations, setTotalInfluentialCitations] = useState(0);
  const [averagePapersPerYear, setAveragePapersPerYear] = useState(0);
  const [topInfluentialAuthors, setTopInfluentialAuthors] = useState([]);

  useEffect(() => {
    if (!searchData || searchData.length < 1) {
      return;
    }
  
    const totalPapersCount = searchData.length;
  
    const totalCitationsCount = searchData.reduce((acc, paper) => {
      return acc + (paper.influentialCitationCount || 0);
    }, 0);
  
    const years = searchData.map((paper) => paper.year).filter(Boolean);
    if (years.length === 0) return;
  
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const yearsRange = maxYear - minYear + 1;
    const avgPapersPerYear = totalPapersCount / yearsRange;
  
    const authorsCitationCount = {};
    searchData.forEach((paper) => {
      if (paper.authors && Array.isArray(paper.authors)) {
        paper.authors.forEach((author) => {
          if (!authorsCitationCount[author.authorId]) {
            authorsCitationCount[author.authorId] = {
              name: author.name,
              citationCount: paper.influentialCitationCount || 0,
            };
          } else {
            authorsCitationCount[author.authorId].citationCount +=
              paper.influentialCitationCount || 0;
          }
        });
      }
    });
  
    const sortedAuthors = Object.values(authorsCitationCount).sort(
      (a, b) => b.citationCount - a.citationCount
    );
    const topAuthors = sortedAuthors.slice(0, 3);
  
    setTotalPapers(totalPapersCount);
    setTotalInfluentialCitations(totalCitationsCount);
    setAveragePapersPerYear(avgPapersPerYear.toFixed(2));
    setTopInfluentialAuthors(topAuthors);
  }, [searchData]);
  
  return (
    <div
      className="visualizationContainer"
      style={{
        padding: 2,
        borderRadius: "8px",
        height: "75vh",
        width: "100%",
        overflowY: "auto",
      }}
    >
      {
        searchData && searchData.length > 0 ? (
          <div>
            <div>
              <Grid container columns={16}>
                <Grid size={4}>
                  <CardComponent title="Total Research Papers" value={totalPapers} />
                </Grid>
                <Grid size={4}>
                  <CardComponent
                    title="Total Influential Citations"
                    value={totalInfluentialCitations}
                  />
                </Grid>
                <Grid size={4}>
                  <CardComponent
                    title="Average Papers per Year"
                    value={averagePapersPerYear}
                  />
                </Grid>
                {topInfluentialAuthors.length > 0 ? (
                  <Grid size={4}>
                    <CardComponent
                      title="Top Influential Authors"
                      value={topInfluentialAuthors[0].name}
                    />
                  </Grid>
                ) : (
                  <Grid size={4}>
                    <CardComponent
                      title="Top Influential Authors"
                      value="-"
                    />
                  </Grid>
                )}
              </Grid>
            </div>
            <div>
              <Grid container columns={18} spacing={3} sx={{ margin: "0 16px 16px 16px" }}>
                <Grid size={9}>
                  <Box>
                    <Card elevation={3} className="card">{visualizeFieldOfStudy(searchData, 300, 212)}</Card>
                  </Box>
                </Grid>
                <Grid size={9}>
                  <Box>
                    <Card elevation={3} className="card">{authorPaperCount(searchData, 300, 250)}</Card>
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box>
                    <Card elevation={3} className="card">
                      {titlesandInfluentialCitationCount(searchData, 300, 250)}
                    </Card>
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box>
                    <Card elevation={3} className="card">
                      {paperTitlesandReferenceCounts(searchData, 300, 250)}
                    </Card>
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box>
                    <Card elevation={3} className="card" sx={{ borderRadius: 0, overflow: "auto" }}>
                      {numOfPaperPublisedinYear(searchData, 300, 250)}
                    </Card>
                  </Box>
                </Grid>
                <Grid size={18}>
                  <Box>
                    <Card elevation={3} className="card">
                      {venueCounts(searchData, 300)}
                    </Card>
                  </Box>
                </Grid>
              </Grid>
            </div>
          </div>
        ) : (
          <div
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              verticalAlign: 'middle',
              display: 'flex',
              flexDirection: 'column',
              height: "67vh"
            }}
            className='pdfContent noDataIconDiv'
          >
            <img
              src={noDataIcon}
              alt="Centered"
              style={{ display: 'block', margin: '0 auto' }}
            />
            <p style={{ opacity: "0.5" }}>No Data Available</p>
          </div>
        )
      }
    </div>
  );
}

export default VisualizeData;