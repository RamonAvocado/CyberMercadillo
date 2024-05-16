namespace CyberMercadillo.BusinessLogic{ 
    public class UnitOfWork<T>{

        public UnitOfWork(){}
        
        private Stack<T> UpdatedList = new Stack<T>();
        public Stack<T> AddedList = new Stack<T>();
        private Stack<T> DeletedList = new Stack<T>();
    }
}
