import { Request, Response, NextFunction } from "express";
import Unidade from "../models/Unidade";
import { Pessoa } from "../models/Pessoa";
import Erro from "../errors/Erro";

class UnidadeController {
    static consultarTodasUnidades = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const listaUnidades = await Unidade.find({});
            res.status(200).json(listaUnidades);
        } catch (erro) {
            next(erro);
        }
    }

    static consultarUnidadePorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { unidade_id } = req.params;
            
            if (!unidade_id) {
                throw new Erro('O ID da unidade não foi fornecido!', 400);
            }

            const unidadeResultado = await Unidade.findOne({ unidade_id }).exec();

            if (!unidadeResultado) {
                throw new Erro('Não foi possível encontrar o ID fornecido.', 404);
            }

            res.status(200).json(unidadeResultado);
        } catch (erro) {
            next(erro);
        }
    }

    // Método para adicionar uma nova unidade ao usuário, caso ele esteja associado a múltiplas unidades
    static adicionarUnidade = async (usuario: string, unidade_id: number) => {
        try {
            if (unidade_id === undefined) {
                throw new Erro('Unidade não fornecida!', 400);
            }

            const pessoaAtualizada = await Pessoa.findOneAndUpdate(
                { usuario }, 
                { $addToSet: { unidade_id } }, 
                { new: true }
            );

            if (!pessoaAtualizada) {
                throw new Erro('Usuário não encontrado!', 404);
            }

            return pessoaAtualizada;
        } catch (erro: unknown) {
            
            if (erro instanceof Error) {
                throw new Erro(erro.message, 500);
            }

            throw new Erro('Erro desconhecido.', 500);
        }
    }
}

export default UnidadeController;
