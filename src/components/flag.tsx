function Flag({ flag }: { flag: string }) {
  return (
    <div className="h-8 w-8 text-xl flex justify-center items-center font-[BabelStoneFlags]">
      {flag}
    </div>
  );
}

export default Flag;
