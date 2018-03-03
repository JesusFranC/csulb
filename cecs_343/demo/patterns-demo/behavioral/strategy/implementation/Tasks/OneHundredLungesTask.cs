namespace patterns_demo.behavioral.strategy.implementation
{
    using patterns_demo.behavioral.strategy.contract;
    public class OneHundredLungesTask : ITask
    {
        public ITask NextTask {get; set;}

        public void Execute()
        {
            // Do 100 lunges
        }
    }
}