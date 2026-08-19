import { create } from 'zustand';
import { Filter } from '../../types';
type FilterStoreType = {
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
  setFilter: (filters: Filter) => void;
  removeFilter: (type: Filter['type']) => Filter[];
  clearFilters: () => void;
  getFilter: (type: Filter[keyof Filter]) => Filter | undefined;
};
export const useFilterStore = create<FilterStoreType>((set, get) => ({
  filters: [],
  setFilters: (filters) => {
    set(() => ({
      filters
    }));
  },
  setFilter: (filter: Filter)=>{
    set((preState)=>{
        let updatedFilters = get().filters;
        if(preState.filters.find(f => f.type === filter.type)){
            updatedFilters = preState.filters.map(f =>{
                if(f.type === filter.type) {
                    return filter;
                }
                return f;
            });
            
        }
        else{
           updatedFilters = [...updatedFilters, filter];
        }
        return {
            filters: updatedFilters
        } 
    })
  },
  getFilter: (type) => {
    return get().filters.find((filter) => filter.type === type);
  },
  removeFilter: (type) => {
    const updatedFilters = get().filters.filter((filter) => filter.type !== type);
    set({filters: updatedFilters});
    return updatedFilters
  },
  clearFilters: () => {
    set({ filters: [] });
  }
}));
