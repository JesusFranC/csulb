namespace solid_demo.InterfaceSegregation.After
{
    public interface IEmployee
    {
        // Public properties
        string FirstName {get;}
        string LastName {get;}
        string Department {get;}
        Room Office {get;}

        // Public methods
        void UpdateOffice(Room newOffice);
        void DoWork();

    }
}