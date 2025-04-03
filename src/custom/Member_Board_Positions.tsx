'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function BoardMembersListComponent() {
  const [boardMemberPositions, setBoardMemberPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memberData, setMemberData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
        const memberID = urlParams.get('MembersID');
        if (!memberID) {
          setError('Member ID not found in URL parameters');
          setLoading(false);
          return;
        }
        const memberResponse = await fetch(`/api/members?ID=${memberID}`);
        if (!memberResponse.ok) {
          throw new Error(`Failed to fetch member data: ${memberResponse.status}`);
        }
        const memberData = await memberResponse.json();
        setMemberData(memberData.length > 0 ? memberData[0] : null);
        const boardMembersResponse = await fetch(`/api/boardmembers`);
        if (!boardMembersResponse.ok) {
          throw new Error(`Failed to fetch board members: ${boardMembersResponse.status}`);
        }
        const boardMembersData = await boardMembersResponse.json();
        const memberBoardPositions = boardMembersData.filter(bm => bm.MembersID === memberID);
        if (memberBoardPositions.length === 0) {
          setLoading(false);
          return;
        }
        const boardPositionsResponse = await fetch(`/api/boardpositions`);
        if (!boardPositionsResponse.ok) {
          throw new Error(`Failed to fetch board positions: ${boardPositionsResponse.status}`);
        }
        const boardPositionsData = await boardPositionsResponse.json();
        const combinedData = memberBoardPositions.map(boardMember => {
          const position = boardPositionsData.find(pos => pos.ID === boardMember.BoardPositionsID);
          return {
            ...boardMember,
            positionTitle: position ? position.title : "Unknown Position",
            positionDescription: position ? position.description : ""
          };
        });
        const sortedData = combinedData.sort((a, b) => {
          return new Date(b.term_start) - new Date(a.term_start);
        });
        setBoardMemberPositions(sortedData);
      } catch (err) {
        setError(`Error fetching data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const formatDate = dateString => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  return <div className='p-4'><h1 className='mb-6'>Board Positions</h1>{loading ? <p>Loading board positions data...</p> : error ? <p>{error}</p> : <React.Fragment>{memberData && <div className='mb-6'><p>{`Viewing board positions for ${memberData.first_name} ${memberData.last_name}`}</p></div>}{boardMemberPositions.length === 0 ? <p>This member does not hold any board positions.</p> : <div className='space-y-4'>{boardMemberPositions.map(position => <div key={position.ID} className='border p-4 rounded'><h2 className='mb-2'>{position.positionTitle}</h2><div className='mb-2'><span className='mr-2'>Term:</span><span>{`${formatDate(position.term_start)} - ${position.term_end ? formatDate(position.term_end) : 'Present'}`}</span></div>{position.bio && <div className='mt-2'><h3 className='mb-1'>Bio:</h3><p>{position.bio}</p></div>}</div>)}</div>}</React.Fragment>}</div>;
}