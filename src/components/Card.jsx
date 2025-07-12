export default function Card({ card, onClick }) {
  return (
    <div
      className={`card ${card.isFlipped || card.isMatched ? "flipped" : ""}`}
      onClick={onClick}
    >
      <div className="card-inner">
        <div className="card-front">❓</div>
        <div className="card-back">{card.symbol}</div>
      </div>
    </div>
  );
}
