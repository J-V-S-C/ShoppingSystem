
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const Itens = require('../model/itens')

class Auth {
    static verificarAutenticacao(req, res, next) {
        const token = req.cookies.token;

        if (token) {
            try {
                const payload = jwt.verify(token, JWT_SECRET);
                req.usuario = payload;
                return next();
            } catch (err) {
                return res.redirect('/login?error=Token inválido ou expirado');
            }
        }

        if (req.session && req.session.autenticado) {
            req.usuario = {
                id: req.session.usuarioId,
                tipo: req.session.tipo
            };
            return next(); 
        }
        

        return res.redirect('/login?error=Você precisa estar logado');
    }

    static async verificarOwner(req, res, next)
    {
        const itemId = req.params.id;
        const [item] = await Itens.buscarItensPorID(itemId);
        const tipo = req.usuario?.tipo || req.session?.tipo;

        if(!item){
            return res.redirect('/itens?error=Item não encontrado');
        }

        const userId = req.usuario?.id || req.session?.usuarioId;

        if( item.usuario_id !== userId && tipo !== 'admin'){
                return res.redirect('/itens?error=Você não tem permissão para alterar itens de outras pessoas');
            
        }
        next()
    }

    static verificarAdmin(req, res, next) {
        const tipo = req.usuario?.tipo || req.session?.tipo;
    
        if (tipo !== 'admin') {
            return res.redirect('/itens?error=Você não tem permissão para acessar esta área');
        }
    
        next();
    }
    
}

module.exports = Auth