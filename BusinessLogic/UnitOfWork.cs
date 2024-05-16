namespace CyberMercadillo.BusinessLogic{ 
    public class UnitOfWork<T> where T : notnull{

        public UnitOfWork(){}
        
        //private Stack<T> UpdatedList = new Stack<T>();
        private Dictionary<T, T> UpdatedDictionary = new Dictionary<T, T>();

        public Stack<T> AddedList = new Stack<T>();
        private Stack<T> DeletedList = new Stack<T>();

        public void UpdateItem(T currentItem, T updatedItem)
        {
            if (UpdatedDictionary.ContainsKey(currentItem))
            {
                UpdatedDictionary[currentItem] = updatedItem;
            }
            else
            {
                UpdatedDictionary.Add(currentItem, updatedItem);
            }
        }
    }
}
