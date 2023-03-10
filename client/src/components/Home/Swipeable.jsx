import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { Card, CardContent, Grid } from "@mui/material";

const isMobile = window.innerWidth < 800;

const tips = [
  {
    tip: "Irse a la cama y despertar a la misma hora todos los días",
    im: "https://www.sindelen.cl/blog/wp-content/uploads/2019/08/young-happy-woman-woke-morning-260nw-710491804-e1565788045909.jpg",
  },
  {
    tip: "Evitar el consumo de cafeína, especialmente por la tarde y noche",
    im: "https://www.innaturale.com/es/wp-content/uploads/2018/09/Cuando-es-mejor-tomar-cafe%CC%81.jpg",
  },
  {
    tip: "Evitar la nicotina",
    im: "https://okdiario.com/img/2022/09/07/10-razones-para-no-fumar-que-tambien-afectan-a-la-belleza.jpg",
  },
  {
    tip: "Hacer ejercicio con regularidad, pero no demasiado tarde",
    im: "https://www.mnsa.es/wp-content/uploads/buen-ejercicio-imgp.jpg",
  },
  {
    tip: "Evitar las bebidas alcohólicas antes de acostarse",
    im: "https://img.gruporeforma.com/imagenes/960x640/4/935/3934513.jpg",
  },
  {
    tip: "Evitar comidas y bebidas pesadas por la noche",
    im: "https://static.elcomercio.es/www/multimedia/202005/27/media/cortadas/atracon_interior_noticia_624-kIwH-U110319488214g8-624x385@RC.png",
  },
  {
    tip: "No tomar siestas después de las 3 de la tarde",
    im: "https://media.revistagq.com/photos/5ca5ef8543a819b9945599a8/16:9/w_1280,c_limit/dormir_la_siesta_892.jpg",
  },
  {
    tip: "Relajarse antes de acostarse, por ejemplo, tomando un baño leyendo o escuchando música suave",
    im: "https://www.colchonexpres.com/blog/wp-content/uploads/2017/05/como-relajarse-para-dormir-1.jpg",
  },
  {
    tip: " Deshacerse de distracciones como ruidos, luces brillantes y el televisor o computadora",
    im: "https://cdnb.20m.es/sites/91/2016/07/las-bombillas-edison-apagan-europa-1346409905559.jpg",
  },
  {
    tip: " Consulte a un médico si tiene problemas constantes para dormir",
    im: "https://farmaplaya.com/blog/wp-content/uploads/2021/02/Imagen1-720x320.jpg",
  },
];

const maxSteps = tips.length;

function Swipeable() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Card sx={{ boxShadow: 2 }}>
      <CardContent>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <Typography
              sx={{
                fontSize: !isMobile ? 24 : 22,
                fontWeight: "bold",
                padding: "0.8rem",
              }}
            >
              Tips para dormir mejor
            </Typography>
          </Grid>
          <Grid>
            <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
              <SwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
              >
                {tips.map((step, index) => (
                  <div
                    key={`step-${index}`}
                    style={{
                      overflow: "hidden",
                      height: "230px",
                      maxHeight: "230px",
                    }}
                  >
                    {Math.abs(activeStep - index) <= 2 ? (
                      <Box
                        component="img"
                        sx={{
                          height: "auto",
                          display: "block",
                          maxWidth: 400,
                          overflow: "hidden",
                          width: "100%",
                        }}
                        src={step.im}
                        alt={step.tip}
                      />
                    ) : null}
                  </div>
                ))}
              </SwipeableViews>
            </Box>
          </Grid>

          <Grid item>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: 16,
                textAlign: "center",
                height: "4rem",
                paddingTop: "20px",
              }}
            >
              {tips[activeStep].tip}
            </Typography>
          </Grid>
          <Grid item>
            <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  size="small"
                  onClick={handleNext}
                  disabled={activeStep === maxSteps - 1}
                >
                  Next
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                  ) : (
                    <KeyboardArrowLeft />
                  )}
                  Back
                </Button>
              }
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default Swipeable;
