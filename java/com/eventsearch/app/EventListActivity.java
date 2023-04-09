package com.eventsearch.app;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager2.adapter.FragmentStateAdapter;
import androidx.viewpager2.widget.ViewPager2;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;
import java.util.List;

public class EventListActivity extends AppCompatActivity {
    private String mEvents;

    private String keyword;

    private String location;

    private String distance;

    private String category;

    private TabLayout tabLayout;
    private ViewPager2 viewPager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_list);

        Intent intent = getIntent();
//        mEvents = intent.getStringExtra("event_list");

        keyword = intent.getStringExtra("keyword");

        location = intent.getStringExtra("location");

        distance = intent.getStringExtra("distance");

        category = intent.getStringExtra("category");

        // Enable the ActionBar
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.show();
        }

        tabLayout = findViewById(R.id.tabLayoutEvents);
        viewPager = findViewById(R.id.viewPagerEvents);

        viewPager.setAdapter(new FragmentStateAdapter(this) {
            @NonNull
            @Override
            public Fragment createFragment(int position) {
                // Return the fragment for the corresponding tab.
                switch (position) {
                    case 0:
                        EventListFragment eventListFragment = new EventListFragment();
                        Bundle bundle = new Bundle();
//                        bundle.putString("event_list", (String) mEvents);
                        bundle.putString("keyword", keyword);
                        bundle.putString("location", location);
                        bundle.putString("distance", distance);
                        bundle.putString("category", category);
                        eventListFragment.setArguments(bundle);
                        return eventListFragment;
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

        new TabLayoutMediator(tabLayout, viewPager, (tab, position) -> {
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

        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                Log.d("HomeActivity", "onTabSelected: " + tab.getPosition());
                viewPager.setCurrentItem(tab.getPosition());
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }
        });
    }
}