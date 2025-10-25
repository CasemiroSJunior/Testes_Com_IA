import { Router, Request, Response } from "express";
import ai from "../gemini";
import prisma from "../prisma";

const router = Router();

export const generateContent = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt é obrigatório" });
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    await prisma.prompt.create({
      data: {
        prompt,
        response: response.text,
        userId: req.body.userId || null,
        responseId: response.responseId,
        tokenUsage: response.usageMetadata?.totalTokenCount
      },
    });

    res.json({ response });
  } catch (err) {
    res.status(500).json({ error: "Erro ao gerar conteúdo" });
  }
};

export const getPrompts = async (req: Request, res: Response) => {
  try {
    const prompts = await prisma.prompt.findMany();
    res.json(prompts);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar prompts" });
  }
};

export const getPromptById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const prompt = await prisma.prompt.findUnique({ where: { id } });
    if (!prompt) {
      return res.status(404).json({ error: "Prompt não encontrado" });
    }
    res.json(prompt);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar prompt" });
  }
};

export const getPromptByUserId = async (req: Request, res: Response) => {
   try {
      const userId = Number(req.params.userId);
      const prompts = await prisma.prompt.findMany({ where: { userId } });
      res.json(prompts);
   } catch (err) {
      res.status(500).json({ error: "Erro ao buscar prompts do usuário" });
   }
};

router.post("/generate", generateContent);
router.get("/prompts", getPrompts);
router.get("/prompts/:id", getPromptById);
router.get("/user/:userId/prompts", getPromptByUserId);

export default router;
