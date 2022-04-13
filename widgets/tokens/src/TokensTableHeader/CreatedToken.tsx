interface CreatedTokenProps {
    value: string;
}

const CreatedToken = ({ value }: CreatedTokenProps) => {
    return <div>{value}</div>;
};

export default CreatedToken;
