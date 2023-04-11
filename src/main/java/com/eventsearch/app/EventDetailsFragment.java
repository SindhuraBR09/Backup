package com.eventsearch.app;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.bumptech.glide.Glide;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link EventDetailsFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class EventDetailsFragment extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private Event selectedEvent;

    public ImageView mImageView;
    public TextView mDate;
    public TextView mTime;
    public TextView mArtists;
    public TextView mVenueName;
    public TextView mGenres;
    public TextView mPriceRanges;
    public TextView mTicketStatus;
    public TextView mBuyAtURL;

    public LinearLayout eventDetailsCard;

    public ProgressBar pb;

    public EventDetailsFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment EventDetailsFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static EventDetailsFragment newInstance(String param1, String param2) {
        EventDetailsFragment fragment = new EventDetailsFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_event_details, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {

        super.onViewCreated(view, savedInstanceState);

        if (getArguments() != null) {
            selectedEvent = getArguments().getParcelable("selected_event");
        }

        eventDetailsCard = view.findViewById(R.id.eventDetailsCard);
        pb = view.findViewById(R.id.progress_bar);
        mVenueName =  view.findViewById(R.id.venueValue);
        mArtists =  view.findViewById(R.id.artistValue);
        mDate =  view.findViewById(R.id.dateValue);
        mTime =  view.findViewById(R.id.timeValue);
        mPriceRanges =  view.findViewById(R.id.priceValue);
        mGenres = view.findViewById(R.id.genreValue);
        mTicketStatus = view.findViewById(R.id.ticketStatusValue);
        mBuyAtURL = view.findViewById(R.id.buyAtValue);
        mImageView = view.findViewById(R.id.venueImage);

        mVenueName.setText(selectedEvent.getVenue());
        mDate.setText(selectedEvent.getDate());
        mTime.setText(selectedEvent.getTime());
        mGenres.setText(String.join(" | ", selectedEvent.getGenres()));
        mTicketStatus.setText(selectedEvent.getTicketStatus());
        Log.d("EventDetailsFragment", ""+selectedEvent.getSeatMap());
        Glide.with(mImageView.getContext())
                .load(selectedEvent.getSeatMap())
                .centerInside()
                .into(mImageView);
        pb.setVisibility(View.GONE);
        eventDetailsCard.setVisibility(View.VISIBLE);

    }
}