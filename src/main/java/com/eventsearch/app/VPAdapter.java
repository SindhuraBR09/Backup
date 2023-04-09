//package com.eventsearch.app;
//
//import androidx.annotation.NonNull;
//import androidx.annotation.Nullable;
//import androidx.fragment.app.Fragment;
//import androidx.fragment.app.FragmentManager;
//import androidx.fragment.app.FragmentPagerAdapter;
//import androidx.lifecycle.Lifecycle;
//import androidx.viewpager2.adapter.FragmentStateAdapter;
//
//import java.util.ArrayList;
//
//public class VPAdapter extends FragmentStateAdapter {
//
//    private final ArrayList<Fragment> fragmentArrayList = new ArrayList<>();
//    private final ArrayList<String> fragmentTitle = new ArrayList<>();
//
//
//    public VPAdapter(FragmentManager fm, Lifecycle lifecycle) {
//        super(fm, lifecycle);
//    }
//
//    @NonNull
//    @Override
//    public Fragment getItem(int position) {
//        return fragmentArrayList.get(position);
//    }
//
//    @Override
//    public int getCount() {
//        return fragmentArrayList.size();
//    }
//
//    public void addFragment (Fragment fragment, String title) {
//        fragmentArrayList.add(fragment);
//        fragmentTitle.add(title);
//    }
//
//    @Nullable
//    @Override
//    public CharSequence getPageTitle(int position) {
//        return fragmentTitle.get(position);
//    }
//
//    @NonNull
//    @Override
//    public Fragment createFragment(int position) {
//        return null;
//    }
//
//    @Override
//    public int getItemCount() {
//        return 0;
//    }
//}
