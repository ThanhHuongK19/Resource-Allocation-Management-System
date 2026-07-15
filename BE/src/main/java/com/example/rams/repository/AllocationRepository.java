package com.example.rams.repository;

import com.example.rams.entity.Allocation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AllocationRepository extends JpaRepository<Allocation, Long> {

    List<Allocation> findByEmployeeId(Long employeeId);

    @Query("select coalesce(sum(a.allocationPercent), 0) from Allocation a where a.employee.id = :employeeId")
    Integer sumAllocationByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("""
            select coalesce(sum(a.allocationPercent), 0)
            from Allocation a
            where a.employee.id = :employeeId and a.id <> :excludedAllocationId
            """)
    Integer sumAllocationByEmployeeIdExcluding(
            @Param("employeeId") Long employeeId,
            @Param("excludedAllocationId") Long excludedAllocationId
    );
}
