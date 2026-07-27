import { Feed } from "@features/feed";
import { Grid } from "@mui/material";

export const HomePage = () => {
    return (
        <Grid container spacing={3}>
            <Grid {...{item: true, xs: 12 }}>
                <></>
            </Grid>

            <Grid {...{item: true, xs: 12 }}>
                <Feed />
            </Grid>
        </Grid>
    );
};