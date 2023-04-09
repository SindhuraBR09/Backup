package com.eventsearch.app;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.fragment.app.FragmentTransaction;
import androidx.viewpager2.adapter.FragmentStateAdapter;
import androidx.viewpager2.widget.ViewPager2;

import android.os.Bundle;
import android.util.Log;
import android.widget.FrameLayout;

import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;

import java.util.ArrayList;
import java.util.List;

public class HomeActivity extends AppCompatActivity {
    private TabLayout tabLayout2;
    private ViewPager2 viewPager2;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        // Enable the ActionBar
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.show();
        }

        tabLayout2 = findViewById(R.id.tabLayout);
        viewPager2 = findViewById(R.id.viewPager);

        viewPager2.setAdapter(new FragmentStateAdapter(this) {
            @NonNull
            @Override
            public Fragment createFragment(int position) {
                // Return the fragment for the corresponding tab.
                switch (position) {
                    case 0:
                        return new SearchFragment();
                    case 1:
                        return new FavoritesFragment();
                    default:
                        return null;
                }
            }

            @Override
            public int getItemCount() {
                return 2;
            }
        });

        new TabLayoutMediator(tabLayout2, viewPager2, (tab, position) -> {
            // Set the text for the tabs.
            switch (position) {
                case 0:
                    tab.setText("Search");
                    break;
                case 1:
                    tab.setText("Favorite");
                    break;
            }
        }).attach();

        tabLayout2.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                Log.d("HomeActivity", "onTabSelected: " + tab.getPosition());
                viewPager2.setCurrentItem(tab.getPosition());
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }
        });
    }

//    public void onBackPressed() {
//        if (getFragmentManager().getBackStackEntryCount() <= 1) {
//            super.onBackPressed();
//        } else {
//            getFragmentManager().popBackStack();
//        }
//    }

//    public void switchToEventListFragment(ArrayList<Event> events) {
//        EventListFragment eventListFragment = new EventListFragment();
//        Bundle bundle = new Bundle();
//        bundle.putParcelableArrayList("event_list", events);
//        eventListFragment.setArguments(bundle);
//
//        getSupportFragmentManager()
//                .beginTransaction()
//                .remove(sf)
//                .add(eventListFragment, "event_list")
//                .addToBackStack("event_list")
//                .commit();
//    }
}
