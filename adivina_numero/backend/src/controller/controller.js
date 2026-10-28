let numeroSecreto = Math.floor(Math.random() * 100) + 1;

const guessNumber = (req, res) => {
    const { numero } = req.body;
    if (numero === numeroSecreto) {
        return res.json({
            resultado: "correcto",
            mensaje: "¡Adivinaste el número!"
        });
    }
    if (numero < numeroSecreto) {
        return res.json({
            resultado: "mayor",
            mensaje: "El número secreto es mayor"
        });
    }
    return res.json({
        resultado: "menor",
        mensaje: "El número secreto es menor"
    });
};

const resetGame = (req, res) => {
    numeroSecreto = Math.floor(Math.random() * 100) + 1;
    return res.json({
        mensaje: "Juego reiniciado"
    });
};

module.exports = {
    guessNumber,
    resetGame
};