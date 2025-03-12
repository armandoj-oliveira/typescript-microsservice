import { Request, Response } from "express";
import Unidade from "../models/Unidade";
import { Pessoa } from "../models/Pessoa";

class UnidadeController {
    static consultarTodasUnidades = async (req: Request, res: Response): Promise<void> => {
        try {
            const listaUnidades = await Unidade.find({});
            res.status(200).json(listaUnidades);
        } catch(erro) {
            console.log(`Erro ao consultar todas as Unidades: ${(erro as Error).message}`);
            res.status(500).json({ mensagem: 'Erro interno no servidor.' });
        }
    }

    static consultarUnidadePorId = async (req: Request, res: Response): Promise<void> => {
        
        try {
            const { unidade_id } = req.params;
            
            if(!unidade_id) {
                res.status(400).json({ mensagem: 'O ID da unidade não forncido!' });
            }

            const unidadeResultado = await Unidade.find({ unidade_id }).exec();

            // Caso não encontre, possibilidade de cadastrar - implementado mais para frente!
            if(!unidadeResultado) {
                res.status(404).json({ mensagem: 'Não foi possível encontrar o ID fornecido' });
                return;
            }

            res.status(200).json(unidadeResultado);

        } catch (erro) {
            console.log(`Erro ao consultar o id da unidade: ${(erro as Error).message}`);
            res.status(500).json({ mensagem: 'Erro interno no servidor.' });
        }
    }

    // Método para adicionar uma nova unidade ao usuário, caso ele esteja associado a múltiplas unidades
    static adicionarUnidade = async (usuario: string, unidade_id: number) => {
        try{

            if (unidade_id === undefined) {
                throw new Error('Unidade não fornecida!');
            }

            const pessoaAtualizada = await Pessoa.findOneAndUpdate(
                { usuario }, 
                { $addToSet: { unidade_id: unidade_id } }, 
                { new: true }
            );

            return pessoaAtualizada;
        } catch (erro) {
            console.log(`Erro ao adicionar a unidade: ${(erro as Error).message}`);
            throw new Error('Erro interno no servidor.')
        }
    }
}

export default UnidadeController;