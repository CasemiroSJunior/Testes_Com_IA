import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

interface bodyType {
  email?: string;
  id?: number;
  name: string;
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const body: bodyType = req.body;

    const email = body.email ? String(body.email).toLowerCase() : null;

    if (body.id) {
      const existing = await prisma.user.findUnique({ where: { id: body.id } });
      if (existing) {
        return res.status(409).json({ error: "ID já existe" });
      }
      const createdUser = await prisma.user.create({
        data: {
          id: body.id,
          email,
          name: body.name,
        },
      });

      return res.status(201).json({
        name: createdUser.name,
        email: createdUser.email,
        id: createdUser.id,
        success: true,
      });
    }

    const createdUser = await prisma.user.create({
      data: {
        email,
        name: body.name,
      },
    });

    res.status(201).json({
      name: createdUser.name,
      email: createdUser.email,
      id: createdUser.id,
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar usuários" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "id inválido" });
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "id inválido" });
  const body: Partial<bodyType> = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing)
      return res.status(404).json({ error: "Usuário não encontrado" });
    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        email: body.email ?? existing.email,
      },
    });
    res.json({ ...updated, success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "id inválido" });
  try {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing)
      return res.status(404).json({ error: "Usuário não encontrado" });
    await prisma.user.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
};

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
