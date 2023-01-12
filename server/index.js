import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";
// import {Configuration, OpenAIApi} from "openai"
import { Configuration, OpenAIApi } from "openai";
import bodyParser from "body-parser";
dotenv.config();
const app = express();
const PORT = process.env.PORT;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);



app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
console.log(process.env.OPENAI_KEY)

app.get("/", async(req, res) => {
    res.status(200).json("Hello World!");
})

app.post('/', async(req, res) => {
    try {
        const prompt = req.body.prompt;
        console.log(prompt)
        console.log()
        // const response = await openAi.createCompletion({
        //     model: "text-davinci-003",
        //     prompt: `${prompt}`,
        //     temperature: 0,
        //     max_tokens: 3000,
        //     top_p: 1,
        //     frequency_penalty: 0.5,
        //     present_penalty: 0,
        // });
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
          });

        res.status(200).json({bot: response.data.choices[0].text})
    } catch (error) {
        res.status(500).send({error})
    }
})



app.listen(PORT, () => console.log("Server running on port: " + PORT));